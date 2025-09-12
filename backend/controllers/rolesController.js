import createDB from "../config/connection.js";
import generateStudentId from "../lib/generateStdID.js";

export const studentDetail = async (req,res) => {
     try {
         
         const { name, dob, fatherName,fatherOccupation, motherName,motherOccupation,mediumOfInstruction,marksScored,percentage,schoolNamePlace, religion,nationality,category,dateOfAdmission,dateOfLeaving,contactNo,email, aadhaar, address, gender, course, year, photo, bloodGroup,scholarshipDetails, hosteller,hostellerDetail} = req.body;

         //if hostler is false then they should write detail so the hostler is boolean and hostlerdetail is text

        //  const userId = req.userId;

    //    if (!name || !dob || !fatherName || !fatherOccupation || !motherName || !motherOccupation || !mediumOfInstruction || !marksScored || !percentage ||!schoolNamePlace || !religion || !nationality || !category || !dateOfAdmission ||!dateOfLeaving || !contactNo || !email || !aadhaar || !address || !gender || !course || !year || !photo || !bloodGroup || !scholarshipDetails || !hosteller ||!hostellerDetail){
    //  return res.json({ success: false, message: "All fields are required" });
    //      }

         const db = await createDB.getConnection ? await createDB.getConnection() : await createDB();

        // This is to check and give only student to add access 
        // const [userRows] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);
        // if (userRows.length === 0) {
        //     return res.json({ success: false, message: "User not found" });
        // }
        // const user = userRows[0];

        // if(user.role !== 'student'){
        //     return res.json({ success: false, message: "Access denied. Students only." });
        // }

       

        const query = `CREATE TABLE IF NOT EXISTS studentdata (
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
            year INT,
            photo BLOB,
            bloodGroup VARCHAR(10),
            scholarshipDetails VARCHAR(100),
            hosteller BOOLEAN,
            hostellerDetail TEXT,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`;

        await db.execute(query);

        // Insert student data
        const insertQuery = 'INSERT INTO studentdata (name, dob, fatherName,fatherOccupation, motherName, motherOccupation, mediumOfInstruction, marksScored, percentage, schoolNamePlace, religion, nationality, category, dateOfAdmission, dateOfLeaving,contactNo, email, aadhaar, address, gender, course, year, photo, bloodGroup,scholarshipDetails, hosteller, hostellerDetail) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';

        // Replace undefined values with null to avoid SQL errors
        const studentParams = [
            name ?? null,
            dob ?? null, 
            fatherName ?? null,
            fatherOccupation ?? null, 
            motherName ?? null,
            motherOccupation ?? null,
            mediumOfInstruction ?? null,
            marksScored ?? null,
            percentage ?? null,
            schoolNamePlace ?? null, 
            religion ?? null,
            nationality ?? null,
            category ?? null,
            dateOfAdmission ?? null,
            dateOfLeaving ?? null,
            contactNo ?? null,
            email ?? null, 
            aadhaar ?? null, 
            address ?? null, 
            gender ?? null, 
            course ?? null, 
            year ?? null, 
            photo ?? null, 
            bloodGroup ?? null,
            scholarshipDetails ?? null, 
            hosteller ?? null, 
            hostellerDetail ?? null
        ];

        // Check if a student with the same email already exists and if exists then new details cannot be created
        const [existingStudent] = await db.execute('SELECT * FROM studentdata WHERE email = ?', [email ?? null]);
        if (existingStudent.length > 0) {
            return res.status(400).json({ success: false, message: "Form already submitted for this student." });
        }

        await db.execute(insertQuery, studentParams);

        const [studentId] = await db.execute('SELECT id FROM studentdata WHERE email = ?', [email ?? null]);

        await generateStudentId(studentId[0].id);

        res.json({ success: true, message: "Student data inserted successfully."});

    } catch (error) {
        console.log("Error in studentAccess controller",error)
        res.json({ success: false, message: error.message });
    }
}

export const allStudentsData = async (req,res) => {
    try {
        //  const userId = req.userId;

         const db = await createDB.getConnection ? await createDB.getConnection() : await createDB();

        // Fetch user by ID
        // const [userRows] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);
        // if (userRows.length === 0) {
        //     return res.json({ success: false, message: "User not found" });
        // }
        // const user = userRows[0];

        // if(user.role !== 'admin'){
        //     return res.json({ success: false, message: "Access denied. Admins only." });
        // }

        // Fetch all student data
        const [studentsRows] = await db.execute('SELECT * FROM studentData');
        if (studentsRows.length === 0) {
            return res.json({ success: false, message: "No student data found" });
        }
        const students = studentsRows;

        res.json({success: true, students})
    
    } catch (error) {
        console.log("Error in adminAccess controller",error)
        res.json({ success: false, message: error.message });
    }
}

export const viewStudentData = async (req, res) => {

  try {
    const { student_uid } = req.params;

    const db = await createDB.getConnection ? await createDB.getConnection() : await createDB();

    const [studentRows] = await db.execute(
      'SELECT * FROM studentdata WHERE student_uid = ?',
      [student_uid]
    );

    if (!studentRows?.length) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const student = studentRows[0];
    return res.status(200).json({ success: true, student });

  } catch (error) {
    console.error('Error in viewStudentData controller:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const updateStudentDetail = async (req,res) => {
     try {

        const { student_uid } = req.params;
         
        const { name, dob, fatherName, fatherOccupation, motherName, motherOccupation, mediumOfInstruction, marksScored, percentage, schoolNamePlace, religion, nationality, category, dateOfAdmission, dateOfLeaving, contactNo, email, aadhaar, address, gender, course, year, photo, bloodGroup, scholarshipDetails, hosteller, hostellerDetail } = req.body;

        const db = await createDB.getConnection ? await createDB.getConnection() : await createDB();

        // Check if student exists
        const [studentRows] = await db.execute('SELECT * FROM studentdata WHERE student_uid = ?', [student_uid]);
        if (!studentRows.length) {
            return res.status(404).json({ success: false, message: "Student not found." });
        }

        // Update student data
        const updateQuery = `
            UPDATE studentdata SET
            name = ?,
            dob = ?,
            fatherName = ?,
            fatherOccupation = ?,
            motherName = ?,
            motherOccupation = ?,
            mediumOfInstruction = ?,
            marksScored = ?,
            percentage = ?,
            schoolNamePlace = ?,
            religion = ?,
            nationality = ?,
            category = ?,
            dateOfAdmission = ?,
            dateOfLeaving = ?,
            contactNo = ?,
            email = ?,
            aadhaar = ?,
            address = ?,
            gender = ?,
            course = ?,
            year = ?,
            photo = ?,
            bloodGroup = ?,
            scholarshipDetails = ?,
            hosteller = ?,
            hostellerDetail = ?
            WHERE student_uid = ?
        `;

        const studentParams = [
            name ?? null,
            dob ?? null,
            fatherName ?? null,
            fatherOccupation ?? null,
            motherName ?? null,
            motherOccupation ?? null,
            mediumOfInstruction ?? null,
            marksScored ?? null,
            percentage ?? null,
            schoolNamePlace ?? null,
            religion ?? null,
            nationality ?? null,
            category ?? null,
            dateOfAdmission ?? null,
            dateOfLeaving ?? null,
            contactNo ?? null,
            email ?? null,
            aadhaar ?? null,
            address ?? null,
            gender ?? null,
            course ?? null,
            year ?? null,
            photo ?? null,
            bloodGroup ?? null,
            scholarshipDetails ?? null,
            hosteller ?? null,
            hostellerDetail ?? null,
            student_uid
        ];

        await db.execute(updateQuery, studentParams);

        res.json({ success: true, message: "Updated Successfully." });

    } catch (error) {
        console.log("Error in studentAccess controller",error)
        res.json({ success: false, message: error.message });
    }
}

export const deleteStudent = async (req,res) => {
     try {

        const { student_uid } = req.params;

        const db = await createDB.getConnection ? await createDB.getConnection() : await createDB();

        // Check if student exists
        const [studentRows] = await db.execute('SELECT * FROM studentdata WHERE student_uid = ?', [student_uid]);
        if (!studentRows.length) {
            return res.status(404).json({ success: false, message: "Student not found." });
        }

        // Delete student data
        await db.execute('DELETE FROM studentdata WHERE student_uid = ?', [student_uid]);

        res.json({ success: true, message: "Student deleted successfully." });

    } catch (error) {
        console.log("Error in studentAccess controller",error)
        res.json({ success: false, message: error.message });
    }
}
