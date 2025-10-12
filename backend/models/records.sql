-- Create the database 
CREATE DATABASE IF NOT EXISTS pkCollege;

-- Use database
USE pkCollege;

-- Admin or any user table 
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(100) NOT NULL,
  dept VARCHAR(255),
  role ENUM('staffs', 'admin') DEFAULT 'staffs',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Student's Personal Details Table
CREATE TABLE IF NOT EXISTS studentdata (
   id INT AUTO_INCREMENT PRIMARY KEY,
   student_uid VARCHAR(10),
   name VARCHAR(100),
   dob DATE,
   fatherName VARCHAR(100),
   fatherOccupation VARCHAR(100),
   motherName VARCHAR(100),
   motherOccupation VARCHAR(100),
   mediumOfInstruction VARCHAR(50),
   marksScored INT,
   percentage INT,
   schoolNamePlace VARCHAR(100),
   religion VARCHAR(50),
   nationality VARCHAR(50),
   category VARCHAR(50),
   dateOfAdmission DATE,
   dateOfLeaving DATE,
   contactNo VARCHAR(15),
   email VARCHAR(100),
   aadhaar VARCHAR(50),
   address TEXT,
   gender VARCHAR(10),
   course VARCHAR(100),
   year VARCHAR(100),
   photo LONGBLOB NULL,
   bloodGroup VARCHAR(10),
   scholarshipDetails VARCHAR(100),
   createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Ensure student_uid is unique
ALTER TABLE studentdata ADD UNIQUE (student_uid);

-- Fee's Details Table
CREATE TABLE IF NOT EXISTS student_fees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_uid VARCHAR(10),
  feesYear1 DECIMAL(10,2),
  feesYear2 DECIMAL(10,2),
  feesYear3 DECIMAL(10,2),
  feesYear4 DECIMAL(10,2),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_uid) REFERENCES studentdata(student_uid) ON DELETE CASCADE
);

-- Student Attendance Table
CREATE TABLE IF NOT EXISTS student_attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_uid VARCHAR(10),
  attendanceSem1 DECIMAL(5,2),
  attendanceSem2 DECIMAL(5,2),
  attendanceSem3 DECIMAL(5,2),
  attendanceSem4 DECIMAL(5,2),
  attendanceSem5 DECIMAL(5,2),
  attendanceSem6 DECIMAL(5,2),
  attendanceSem7 DECIMAL(5,2),
  attendanceSem8 DECIMAL(5,2),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_uid) REFERENCES studentdata(student_uid) ON DELETE CASCADE
);

-- Student Semester Details Table 
CREATE TABLE IF NOT EXISTS student_semesters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_uid VARCHAR(10),
  examfeesSem1 DECIMAL(10,2),
  examfeesSem2 DECIMAL(10,2),
  examfeesSem3 DECIMAL(10,2),
  examfeesSem4 DECIMAL(10,2),
  examfeesSem5 DECIMAL(10,2),
  examfeesSem6 DECIMAL(10,2),
  examfeesSem7 DECIMAL(10,2),
  examfeesSem8 DECIMAL(10,2),
  gpaSem1 VARCHAR(10),
  gpaSem2 VARCHAR(10),
  gpaSem3 VARCHAR(10),
  gpaSem4 VARCHAR(10),
  gpaSem5 VARCHAR(10),
  gpaSem6 VARCHAR(10),
  gpaSem7 VARCHAR(10),
  gpaSem8 VARCHAR(10),
  cgpaSem1 VARCHAR(10),
  cgpaSem2 VARCHAR(10),
  cgpaSem3 VARCHAR(10),
  cgpaSem4 VARCHAR(10),
  cgpaSem5 VARCHAR(10),
  cgpaSem6 VARCHAR(10),
  cgpaSem7 VARCHAR(10),
  cgpaSem8 VARCHAR(10),
  marksheetSem1 VARCHAR(255),
  marksheetSem2 VARCHAR(255),
  marksheetSem3 VARCHAR(255),
  marksheetSem4 VARCHAR(255),
  marksheetSem5 VARCHAR(255),
  marksheetSem6 VARCHAR(255),
  marksheetSem7 VARCHAR(255),
  marksheetSem8 VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_uid) REFERENCES studentdata(student_uid) ON DELETE CASCADE
);

-- Table to store distinct courses and years

CREATE TABLE IF NOT EXISTS all_courses(
  id INT AUTO_INCREMENT PRIMARY KEY,
  course VARCHAR(100) NOT NULL DEFAULT '',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(course)
);

CREATE TABLE IF NOT EXISTS all_years(
  id INT AUTO_INCREMENT PRIMARY KEY,
  year VARCHAR(100) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(year)
);
