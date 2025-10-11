import createDB  from "../config/connection.js";
import generateStudentId from "../lib/generateStdID.js";

export const studentDetail = async (req, res) => {
  try {
    const {
      name,
      dob,
      fatherName,
      fatherOccupation,
      motherName,
      motherOccupation,
      mediumOfInstruction,
      marksScored,
      percentage,
      schoolNamePlace,
      religion,
      nationality,
      category,
      dateOfAdmission,
      dateOfLeaving,
      contactNo,
      email,
      aadhaar,
      address,
      gender,
      course,
      year,
      bloodGroup,
      scholarshipDetails,
    } = req.body;

    const photo = req.file ? req.file.filename : null;

    const db = (await createDB.getConnection)
      ? await createDB.getConnection()
      : await createDB();

    // Insert student data
    const insertQuery =
      "INSERT INTO studentdata (name, dob, fatherName,fatherOccupation, motherName, motherOccupation, mediumOfInstruction, marksScored, percentage, schoolNamePlace, religion, nationality, category, dateOfAdmission, dateOfLeaving,contactNo, email, aadhaar, address, gender, course, year, photo, bloodGroup,scholarshipDetails) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

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
      scholarshipDetails ?? null
    ];

    // Check if a student with the same email already exists and if exists then new details cannot be created
    const [existingStudent] = await db.execute(
      "SELECT * FROM studentdata WHERE email = ?",
      [email ?? null]
    );
    if (existingStudent.length > 0) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Form already submitted for this student.",
        });
    }

    await db.execute(insertQuery, studentParams);

    const [studentId] = await db.execute(
      "SELECT id FROM studentdata WHERE email = ?",
      [email ?? null]
    );

    await generateStudentId(studentId[0].id);

    const [student_uid] = await db.execute(
      "SELECT student_uid FROM studentdata WHERE email = ?",
      [email ?? null]
    );

    res.json({ success: true, message: "Student data inserted successfully.", student_uid: student_uid[0].student_uid });
  } catch (error) {
    console.log("Error in studentDetail controller", error);
    res.json({ success: false, message: error.message });
  }
};

export const storeExtraStudentData = async (req, res) => {
  try {
    const { student_uid } = req.params;
    const data = req.body;
    const db = (await createDB.getConnection)
      ? await createDB.getConnection()
      : await createDB();

    // Check if student exists
    const [existingFees] = await db.execute(
      "SELECT * FROM student_fees WHERE student_uid = ?",
      [student_uid]
    );

    if(!existingFees) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found." });
    }

      // INSERT new record
    await db.execute(
        "INSERT INTO student_fees (student_uid, feesYear1, feesYear2, feesYear3, feesYear4) VALUES (?, ?, ?, ?, ?)",
        [
          student_uid,
          data.feesYear1 ?? null,
          data.feesYear2 ?? null,
          data.feesYear3 ?? null,
          data.feesYear4 ?? null,
        ]
      );

        await db.execute(
        "INSERT INTO student_attendance (student_uid, attendanceSem1, attendanceSem2, attendanceSem3, attendanceSem4, attendanceSem5, attendanceSem6, attendanceSem7, attendanceSem8) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          student_uid,
          data.attendanceSem1 ?? null,
          data.attendanceSem2 ?? null,
          data.attendanceSem3 ?? null,
          data.attendanceSem4 ?? null,
          data.attendanceSem5 ?? null,
          data.attendanceSem6 ?? null,
          data.attendanceSem7 ?? null,
          data.attendanceSem8 ?? null,
        ]
      );

      await db.execute(
        "INSERT INTO student_semesters (student_uid, examfeesSem1, examfeesSem2, examfeesSem3, examfeesSem4, examfeesSem5, examfeesSem6, examfeesSem7, examfeesSem8, gpaSem1, gpaSem2, gpaSem3, gpaSem4, gpaSem5, gpaSem6, gpaSem7, gpaSem8, cgpaSem1, cgpaSem2, cgpaSem3, cgpaSem4, cgpaSem5, cgpaSem6, cgpaSem7, cgpaSem8, marksheetSem1, marksheetSem2, marksheetSem3, marksheetSem4, marksheetSem5, marksheetSem6, marksheetSem7, marksheetSem8) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
        [
          student_uid,
          data.examfeesSem1 ?? null,
          data.examfeesSem2 ?? null,
          data.examfeesSem3 ?? null,
          data.examfeesSem4 ?? null,
          data.examfeesSem5 ?? null,
          data.examfeesSem6 ?? null,
          data.examfeesSem7 ?? null,
          data.examfeesSem8 ?? null,
          data.gpaSem1 ?? null,
          data.gpaSem2 ?? null,
          data.gpaSem3 ?? null,
          data.gpaSem4 ?? null,
          data.gpaSem5 ?? null,
          data.gpaSem6 ?? null,
          data.gpaSem7 ?? null,
          data.gpaSem8 ?? null,
          data.cgpaSem1 ?? null,
          data.cgpaSem2 ?? null,
          data.cgpaSem3 ?? null,
          data.cgpaSem4 ?? null,
          data.cgpaSem5 ?? null,
          data.cgpaSem6 ?? null,
          data.cgpaSem7 ?? null,
          data.cgpaSem8 ?? null,
          data.marksheetSem1 ?? null,
          data.marksheetSem2 ?? null,
          data.marksheetSem3 ?? null,
          data.marksheetSem4 ?? null,
          data.marksheetSem5 ?? null,
          data.marksheetSem6 ?? null,
          data.marksheetSem7 ?? null,
          data.marksheetSem8 ?? null,
        ]
      );
 
    res.json({ success: true, message: "Student data saved successfully." });
  } catch (error) {
    console.error("Error in storeExtraStudentData:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const viewAllStudentsData = async (req, res) => {
  try {

    const db = (await createDB.getConnection)
      ? await createDB.getConnection()
      : await createDB();

    // Fetch all student data
    const [studentsRows] = await db.execute("SELECT * FROM studentdata");
    if (studentsRows.length === 0) {
      return res.json({ success: false, message: "No student data found" });
    }
    const students = studentsRows;

    res.json({ success: true, students });
  } catch (error) {
    console.log("Error in allStudentsData controller", error);
    res.json({ success: false, message: error.message });
  }
};

export const viewStudentData = async (req, res) => {
  try {
    const { student_uid } = req.params;

    const db = (await createDB.getConnection)
      ? await createDB.getConnection()
      : await createDB();

      // Check if student exists
    const [studentRows] = await db.execute(
      "SELECT * FROM studentdata WHERE student_uid = ?",
      [student_uid]
    );

    if (!studentRows?.length) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    const [student_fees] = await db.execute(
      "SELECT * FROM student_fees WHERE student_uid = ?",
      [student_uid]
    );
    const [student_attendance] = await db.execute(
      "SELECT * FROM student_attendance WHERE student_uid = ?",
      [student_uid]
    );
    const [student_semesters] = await db.execute(
      "SELECT * FROM student_semesters WHERE student_uid = ?",
      [student_uid]
    );

    const student = studentRows[0];
    return res.status(200).json({ success: true, student, student_fees, student_attendance, student_semesters });
  } catch (error) {
    console.error("Error in viewStudentData controller:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const updateStudentDetail = async (req, res) => {
  try {
    const { student_uid } = req.params;

    const {
      name,
      dob,
      fatherName,
      fatherOccupation,
      motherName,
      motherOccupation,
      mediumOfInstruction,
      marksScored,
      percentage,
      schoolNamePlace,
      religion,
      nationality,
      category,
      dateOfAdmission,
      dateOfLeaving,
      contactNo,
      email,
      aadhaar,
      address,
      gender,
      course,
      year,
      bloodGroup,
      scholarshipDetails,
    } = req.body;

    const photo = req.file ? req.file.filename : null;

    // Format all date fields to 'YYYY-MM-DD'
    const formatDate = (date) =>
      date ? new Date(date).toISOString().split("T")[0] : null;

    const dobFormatted = formatDate(dob);
    const doaFormatted = formatDate(dateOfAdmission);
    const dolFormatted = formatDate(dateOfLeaving);

    const db = await createDB();

    //  Check if student exists
    const [studentRows] = await db.execute(
      "SELECT * FROM studentdata WHERE student_uid = ?",
      [student_uid]
    );
    if (!studentRows.length) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found." });
    }

    //  Update query
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
        scholarshipDetails = ?
      WHERE student_uid = ?
    `;

    const params = [
      name ?? null,
      dobFormatted,
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
      doaFormatted,
      dolFormatted,
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
      student_uid,
    ];

    await db.execute(updateQuery, params);

    res.json({ success: true, message: "Student updated successfully!" });
  } catch (error) {
    console.error("Error in updateStudentDetail controller:", error);
    res.json({ success: false, message: error.message });
  }
};

export const updateExtraStudentData = async (req, res) => {
  try {
    const { student_uid } = req.params;
    const data = req.body;
    const db = (await createDB.getConnection)
      ? await createDB.getConnection()
      : await createDB();

    // Check if student exists
    const [existingFees] = await db.execute(
      "SELECT * FROM student_fees WHERE student_uid = ?",
      [student_uid]
    );

    if(!existingFees) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found." });
    }

      // UPDATE existing data
    await db.execute(
        `UPDATE student_fees SET feesYear1=?, feesYear2=?, feesYear3=?, feesYear4=? WHERE student_uid=?`,
        [
          data.feesYear1 ?? null,
          data.feesYear2 ?? null,
          data.feesYear3 ?? null,
          data.feesYear4 ?? null,
          student_uid,
        ]
      );

    await db.execute(
        `UPDATE student_attendance SET attendanceSem1=?, attendanceSem2=?, attendanceSem3=?, attendanceSem4=?, attendanceSem5=?, attendanceSem6=?, attendanceSem7=?, attendanceSem8=? WHERE student_uid=?`,
        [
          data.attendanceSem1 ?? null,
          data.attendanceSem2 ?? null,
          data.attendanceSem3 ?? null,
          data.attendanceSem4 ?? null,
          data.attendanceSem5 ?? null,
          data.attendanceSem6 ?? null,
          data.attendanceSem7 ?? null,
          data.attendanceSem8 ?? null,
          student_uid,
        ]
      );

     await db.execute(
        `UPDATE student_semesters SET examfeesSem1=?, examfeesSem2=?, examfeesSem3=?, examfeesSem4=?, examfeesSem5=?, examfeesSem6=?, examfeesSem7=?, examfeesSem8=?, 
        gpaSem1=?, gpaSem2=?, gpaSem3=?, gpaSem4=?, gpaSem5=?, gpaSem6=?, gpaSem7=?, gpaSem8=?, 
        cgpaSem1=?, cgpaSem2=?, cgpaSem3=?, cgpaSem4=?, cgpaSem5=?, cgpaSem6=?, cgpaSem7=?, cgpaSem8=? ,marksheetSem1=?, marksheetSem2=?,marksheetSem3=?, marksheetSem4=?,marksheetSem5=?, marksheetSem6=?,marksheetSem7=?, marksheetSem8=?  WHERE student_uid=?`,
        [
          data.examfeesSem1 ?? null,
          data.examfeesSem2 ?? null,
          data.examfeesSem3 ?? null,
          data.examfeesSem4 ?? null,
          data.examfeesSem5 ?? null,
          data.examfeesSem6 ?? null,
          data.examfeesSem7 ?? null,
          data.examfeesSem8 ?? null,
          data.gpaSem1 ?? null,
          data.gpaSem2 ?? null,
          data.gpaSem3 ?? null,
          data.gpaSem4 ?? null,
          data.gpaSem5 ?? null,
          data.gpaSem6 ?? null,
          data.gpaSem7 ?? null,
          data.gpaSem8 ?? null,
          data.cgpaSem1 ?? null,
          data.cgpaSem2 ?? null,
          data.cgpaSem3 ?? null,
          data.cgpaSem4 ?? null,
          data.cgpaSem5 ?? null,
          data.cgpaSem6 ?? null,
          data.cgpaSem7 ?? null,
          data.cgpaSem8 ?? null,
          data.marksheetSem1 ?? null,
          data.marksheetSem2 ?? null,
          data.marksheetSem3 ?? null,
          data.marksheetSem4 ?? null,
          data.marksheetSem5 ?? null,
          data.marksheetSem6 ?? null,
          data.marksheetSem7 ?? null,
          data.marksheetSem8 ?? null,
          student_uid,
        ]
      );

    res.json({ success: true, message: "Student fee's,attendance and semester details updated successfully." });
  } catch (error) {
    console.error("Error in updateExtraStudentData:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete
export const deleteStudent = async (req, res) => {
  try {
    const { student_uid } = req.params;

    const db = (await createDB.getConnection)
      ? await createDB.getConnection()
      : await createDB();

    // Check if student exists
    const [studentRows] = await db.execute(
      "SELECT * FROM studentdata WHERE student_uid = ?",
      [student_uid]
    );
    if (!studentRows.length) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found." });
    }

    // Delete student data
    await db.execute("DELETE FROM studentdata WHERE student_uid = ?", [
      student_uid,
    ]);

    res.json({ success: true, message: "Student deleted successfully." });
  } catch (error) {
    console.log("Error in studentAccess controller", error);
    res.json({ success: false, message: error.message });
  }
};

// Get LoggedIn User datas
export const getLoggedInUserData = async (req,res) => {
    try{
    const  userId  = req.userId;

   const db = await createDB.getConnection ? await createDB.getConnection() : await createDB();

        // Find user by email
        const [userRows] = await db.execute('SELECT * FROM users WHERE id = ?', [userId]);
        if (userRows.length === 0) {
            return res.json({ success: false, message: 'User not found' });
        }
        const user = userRows[0];

    if(!user){
        return res.json({success:false,message:'User Not Found'});
    }

  return res.json({
        success:true,
        userData:{
            name: user.name,
            email:user.email,
            role: user.role,
            dept: user.dept
        }
    })

    } catch(error){
      return res.json({success:false,message:error.message});
    }
}

export const editFormData = async (req, res) => {
  try {
    const { course, year } = req.body;
    const db = (await createDB.getConnection)
      ? await createDB.getConnection()
      : await createDB();
    await db.execute("ALTER TABLE studentdata MODIFY course = ? WHERE id = 1", [course]);
    await db.execute("ALTER TABLE studentdata MODIFY year = ? WHERE id = 1", [year]);
    res.json({ success: true, message: "Form configuration updated successfully." });
  } catch (error) {
    console.error("Error in editFormData controller:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}

export const getDistinctCoursesAndYears = async (req, res) => {
  try {
    const db = (await createDB.getConnection)
      ? await createDB.getConnection()
      : await createDB(); 
    const [courses] = await db.execute("SELECT DISTINCT course FROM studentdata");
    const [years] = await db.execute("SELECT DISTINCT year FROM studentdata");
    res.json({ success: true, courses: courses.map(c => c.course), years: years.map(y => y.year) });
  } catch (error) {
    console.error("Error in getDistinctCoursesAndYears controller:", error);
    res.status(500).json({ success: false, message: error.message });
  }
}