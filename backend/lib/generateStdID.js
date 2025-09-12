import createDB from "../config/connection.js";

async function generateStudentId(data) {
  try {
    const db = await createDB.getConnection ? await createDB.getConnection() : await createDB();

    const student_uid = `PK${String(data).padStart(6, '0')}`; // Format: PK000001

    await db.execute('UPDATE studentdata SET student_uid = ? WHERE id = ?',
      [student_uid, data]
    );

    console.log(`Student created with ID: ${student_uid}`);
    return student_uid;
  } catch (error) {
    console.error('Error generating student id:', error);
    throw error;
  }
}

export default generateStudentId;