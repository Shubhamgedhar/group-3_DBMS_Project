-- PART 1: DROP EXISTING TABLES
DROP TABLE IF EXISTS visitors   CASCADE;      
DROP TABLE IF EXISTS complaints CASCADE;
DROP TABLE IF EXISTS fees       CASCADE;
DROP TABLE IF EXISTS users      CASCADE;
DROP TABLE IF EXISTS students   CASCADE;
DROP TABLE IF EXISTS staff      CASCADE;
DROP TABLE IF EXISTS rooms      CASCADE;

-- PART 2: CREATE TABLES

CREATE TABLE rooms (
    room_no   VARCHAR(10)  PRIMARY KEY,
    capacity  INT          NOT NULL,
    status    VARCHAR(20)  NOT NULL DEFAULT 'Vacant',
    floor     INT          NOT NULL,
    room_type VARCHAR(20)  NOT NULL
);

CREATE TABLE staff (
    staff_id   SERIAL       PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    position   VARCHAR(50)  NOT NULL,
    contact_no VARCHAR(15)  NOT NULL,
    salary     DECIMAL(10,2),
    join_date  DATE         NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE students (
    roll_no    VARCHAR(20)  PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    department VARCHAR(50)  NOT NULL,
    room_no    VARCHAR(10)  REFERENCES rooms(room_no),
    year       VARCHAR(10)  NOT NULL,
    contact_no VARCHAR(15),
    email      VARCHAR(100),
    date_joined DATE        NOT NULL DEFAULT CURRENT_DATE,
    status     VARCHAR(20)  NOT NULL DEFAULT 'Active'
);

CREATE TABLE fees (
    fee_id         SERIAL        PRIMARY KEY,
    roll_no        VARCHAR(20)   NOT NULL REFERENCES students(roll_no),
    amount         DECIMAL(10,2) NOT NULL,
    due_date       DATE          NOT NULL,
    payment_date   DATE,
    status         VARCHAR(20)   NOT NULL DEFAULT 'Unpaid',
    receipt_number VARCHAR(50)
);

CREATE TABLE complaints (
    complaint_id  SERIAL      PRIMARY KEY,
    roll_no       VARCHAR(20) NOT NULL REFERENCES students(roll_no),
    complaint     TEXT        NOT NULL,
    type          VARCHAR(30) NOT NULL,
    severity      VARCHAR(20) NOT NULL DEFAULT 'Medium',
    status        VARCHAR(20) NOT NULL DEFAULT 'Pending',
    date_logged   TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
    date_resolved TIMESTAMP,
    resolution_notes TEXT
);

CREATE TABLE visitors (
    visitor_id     SERIAL       PRIMARY KEY,
    roll_no        VARCHAR(20)  NOT NULL REFERENCES students(roll_no),
    visitor_name   VARCHAR(100) NOT NULL,
    visit_date     DATE         NOT NULL DEFAULT CURRENT_DATE,
    purpose        TEXT,
    check_in_time  TIMESTAMP,
    check_out_time TIMESTAMP
);

CREATE TABLE users (
    user_id        SERIAL      PRIMARY KEY,
    username       VARCHAR(50) NOT NULL UNIQUE,
    password_hash  VARCHAR(100) NOT NULL,
    role           VARCHAR(20) NOT NULL DEFAULT 'Student',
    roll_no        VARCHAR(20) REFERENCES students(roll_no),
    staff_id       INT         REFERENCES staff(staff_id),
    last_login     TIMESTAMP,
    account_status VARCHAR(20) NOT NULL DEFAULT 'Active'
);

-- PART 3: INDEXES

CREATE INDEX idx_students_room   ON students(room_no);
CREATE INDEX idx_fees_roll_status ON fees(roll_no, status);
CREATE INDEX idx_complaints_status ON complaints(status);

-- PART 4: INSERT SAMPLE DATA

-- Rooms
INSERT INTO rooms (room_no, capacity, status, floor, room_type) VALUES
    ('A102', 2, 'Vacant',      1, 'Double'),
    ('A118', 1, 'Vacant',      1, 'Single'),
    ('B201', 4, 'Vacant',      2, 'Quad'),
    ('C302', 2, 'Vacant',      3, 'Double'),
    ('C304', 2, 'Vacant',      3, 'Double'),
    ('C313', 3, 'Vacant',      3, 'Triple'),
    ('D401', 1, 'Maintenance', 4, 'Single'),
    ('D402', 2, 'Vacant',      4, 'Double');

-- Staff
INSERT INTO staff (name, position, contact_no, salary, join_date) VALUES
    ('Harpreet Singh', 'Warden',    '09876543210', 45000, '2018-03-01'),
    ('Meena Devi',     'Caretaker', '09765432109', 28000, '2019-06-15'),
    ('Ramesh Kumar',   'Cleaner',   '09654321098', 18000, '2020-01-10'),
    ('Sunita Sharma',  'Security',  '09543210987', 22000, '2021-07-20');

-- Students (triggers will auto-update room status on insert)
INSERT INTO students (roll_no, name, department, room_no, year, contact_no, email, date_joined) VALUES
    ('102303001', 'Arunima Pillai', 'ECE', 'A118', '2nd', '08047634956', 'arunima.pillai@tiet.ac.in', '2023-08-01'),
    ('102303002', 'Saurabh Iyer',   'EE',  'A102', '2nd', '08756430850', 'saurabh.iyer@tiet.ac.in',   '2021-08-22'),
    ('102303004', 'Sujata Pandey',  'BT',  'C302', '4th', '09116572074', 'sujata.pandey@tiet.ac.in',  '2022-06-24'),
    ('102303006', 'Rajeev Thomas',  'ECE', 'C304', '3rd', '08076246055', 'rajeev.thomas@tiet.ac.in',  '2022-12-28');

-- Fees
INSERT INTO fees (roll_no, amount, due_date, payment_date, status, receipt_number) VALUES
    ('102303001', 50000, '2025-06-30', '2025-05-10', 'Paid',    'REC-001'),
    ('102303002', 50000, '2025-06-30',  NULL,         'Unpaid',  NULL),
    ('102303004', 50000, '2025-06-30', '2025-04-20', 'Paid',    'REC-002'),
    ('102303006', 50000, '2025-06-30',  NULL,         'Partial', NULL);

-- Complaints
INSERT INTO complaints (roll_no, complaint, type, severity, status, date_logged) VALUES
    ('102303002', 'Water leakage in bathroom',         'Maintenance', 'High',   'Pending',  '2025-05-20 16:48:00'),
    ('102303001', 'Room not cleaned for 3 days',       'Cleanliness', 'Low',    'Resolved', '2025-05-20 17:43:00'),
    ('102303006', 'Noise from adjacent room at night', 'Noise',       'Medium', 'Pending',  '2025-05-21 09:00:00');

-- Visitors
INSERT INTO visitors (roll_no, visitor_name, visit_date, purpose, check_in_time) VALUES
    ('102303002', 'Arjun Sharma', '2025-05-15', 'Family visit', '2025-05-15 10:30:00'),
    ('102303004', 'Priya Nair',   '2025-05-20', 'Friend',       '2025-05-20 14:00:00');

-- Users
INSERT INTO users (username, password_hash, role, staff_id, roll_no) VALUES
    ('admin',          'hashed_admin_pass', 'Admin',   NULL, NULL),
    ('harpreet.singh', 'hashed_staff_pass', 'Staff',   1,    NULL),
    ('arunima.pillai', 'hashed_stud_pass',  'Student', NULL, '102303001');

-- PART 5: UPDATE & DELETE EXAMPLES

-- Mark a fee as paid
UPDATE fees
SET status = 'Paid', payment_date = CURRENT_DATE, receipt_number = 'REC-003'
WHERE fee_id = 2;

-- Resolve a complaint
UPDATE complaints
SET status = 'Resolved', resolution_notes = 'Fixed by maintenance team'
WHERE complaint_id = 1;

-- Check out a visitor
UPDATE visitors
SET check_out_time = CURRENT_TIMESTAMP
WHERE visitor_id = 1;

-- Mark room under maintenance
UPDATE rooms SET status = 'Maintenance' WHERE room_no = 'B201';

-- Delete a visitor record
DELETE FROM visitors WHERE visitor_id = 2;

-- PART 6: SELECT QUERIES

-- All students with room info
SELECT s.roll_no, s.name, s.department, s.year, s.room_no, s.status
FROM   students s
ORDER  BY s.department;

-- All vacant rooms
SELECT room_no, room_type, capacity, floor
FROM   rooms
WHERE  status = 'Vacant'
ORDER  BY floor, room_no;

-- Unpaid / partial fees with student name
SELECT f.fee_id, s.name, f.roll_no, f.amount, f.due_date, f.status
FROM   fees f
JOIN   students s ON f.roll_no = s.roll_no
WHERE  f.status != 'Paid'
ORDER  BY f.due_date;

-- All complaints with student name
SELECT c.complaint_id, s.name, c.type, c.severity, c.status, c.date_logged
FROM   complaints c
JOIN   students s ON c.roll_no = s.roll_no
ORDER  BY c.date_logged DESC;

-- Visitor log with resident details
SELECT v.visitor_name, s.name AS resident, s.room_no,
       v.visit_date, v.purpose, v.check_in_time, v.check_out_time
FROM   visitors v
JOIN   students s ON v.roll_no = s.roll_no
ORDER  BY v.visit_date DESC;

-- Room occupancy summary
SELECT status, COUNT(*) AS total
FROM   rooms
GROUP  BY status;

-- Fee collection summary
SELECT status, SUM(amount) AS total_amount
FROM   fees
GROUP  BY status;
