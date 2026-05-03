-- PART 7: TRIGGERS

-- TRIGGER 1: Prevent assigning a non-vacant room to a student

CREATE OR REPLACE FUNCTION check_room_vacancy()
RETURNS TRIGGER AS $$
DECLARE
    v_status VARCHAR(20);
BEGIN
    IF NEW.room_no IS NULL THEN
        RETURN NEW;
    END IF;

    SELECT status INTO v_status FROM rooms WHERE room_no = NEW.room_no;

    IF v_status != 'Vacant' THEN
        RAISE EXCEPTION 'Room % is not vacant (current status: %)', NEW.room_no, v_status;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_check_room_vacancy
BEFORE INSERT OR UPDATE ON students
FOR EACH ROW
EXECUTE FUNCTION check_room_vacancy();

-- TRIGGER 2: Auto-update room status on student insert/delete

CREATE OR REPLACE FUNCTION update_room_status()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.room_no IS NOT NULL THEN
        UPDATE rooms SET status = 'Occupied' WHERE room_no = NEW.room_no;

    ELSIF TG_OP = 'DELETE' AND OLD.room_no IS NOT NULL THEN
        UPDATE rooms SET status = 'Vacant' WHERE room_no = OLD.room_no;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_update_room_status
AFTER INSERT OR DELETE ON students
FOR EACH ROW
EXECUTE FUNCTION update_room_status();

-- TRIGGER 3: Auto-set date_resolved when complaint is resolved

CREATE OR REPLACE FUNCTION auto_resolve_date()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'Resolved' AND OLD.status != 'Resolved' THEN
        NEW.date_resolved := CURRENT_TIMESTAMP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_auto_resolve_date
BEFORE UPDATE ON complaints
FOR EACH ROW
EXECUTE FUNCTION auto_resolve_date();

-- PART 8: FUNCTIONS

-- FUNCTION 1: Get all vacant rooms
-- Usage: SELECT * FROM get_vacant_rooms();

CREATE OR REPLACE FUNCTION get_vacant_rooms()
RETURNS TABLE (
    room_no   VARCHAR,
    room_type VARCHAR,
    capacity  INT,
    floor     INT
) AS $$
BEGIN
    RETURN QUERY
        SELECT r.room_no, r.room_type, r.capacity, r.floor
        FROM   rooms r
        WHERE  r.status = 'Vacant'
        ORDER  BY r.floor, r.room_no;
END;
$$ LANGUAGE plpgsql;

-- FUNCTION 2: Get pending fees for all students
-- Usage: SELECT * FROM get_pending_fees();

CREATE OR REPLACE FUNCTION get_pending_fees()
RETURNS TABLE (
    fee_id       INT,
    roll_no      VARCHAR,
    student_name VARCHAR,
    amount       DECIMAL,
    due_date     DATE,
    status       VARCHAR
) AS $$
BEGIN
    RETURN QUERY
        SELECT f.fee_id, f.roll_no, s.name,
               f.amount, f.due_date, f.status
        FROM   fees f
        JOIN   students s ON f.roll_no = s.roll_no
        WHERE  f.status != 'Paid'
        ORDER  BY f.due_date;
END;
$$ LANGUAGE plpgsql;

-- FUNCTION 3: Get complaint summary by status
-- Usage: SELECT * FROM get_complaint_summary();

CREATE OR REPLACE FUNCTION get_complaint_summary()
RETURNS TABLE (
    status VARCHAR,
    total  BIGINT
) AS $$
BEGIN
    RETURN QUERY
        SELECT c.status, COUNT(*) AS total
        FROM   complaints c
        GROUP  BY c.status
        ORDER  BY c.status;
END;
$$ LANGUAGE plpgsql;

-- PART 9: CURSOR (Simple Example)

-- CURSOR: Loop through all active students
-- Usage: SELECT * FROM cursor_active_students();

CREATE OR REPLACE FUNCTION cursor_active_students()
RETURNS TABLE (
    roll_no    VARCHAR,
    name       VARCHAR,
    department VARCHAR,
    room_no    VARCHAR,
    year       VARCHAR
) AS $$
DECLARE
    cur CURSOR FOR
        SELECT s.roll_no, s.name, s.department, s.room_no, s.year
        FROM   students s
        WHERE  s.status = 'Active'
        ORDER  BY s.department;
    rec RECORD;
BEGIN
    OPEN cur;
    LOOP
        FETCH cur INTO rec;
        EXIT WHEN NOT FOUND;
        roll_no    := rec.roll_no;
        name       := rec.name;
        department := rec.department;
        room_no    := rec.room_no;
        year       := rec.year;
        RETURN NEXT;
    END LOOP;
    CLOSE cur;
END;
$$ LANGUAGE plpgsql;
