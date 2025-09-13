import createDB from "../config/connection.js";

export const categoryList = async (req, res) => {
  try {
    const { year } = req.params;

    const db = (await createDB.getConnection)
      ? await createDB.getConnection()
      : await createDB();

    const [studentRows] = await db.execute(
      `SELECT 
         category,
         COUNT(CASE WHEN gender = 'Male' THEN 1 END) AS boys,
         COUNT(CASE WHEN gender = 'Female' THEN 1 END) AS girls,
         COUNT(*) AS total
       FROM studentdata
       WHERE year = ?
       GROUP BY category
       ORDER BY category;`,
      [year]
    );

    if (!studentRows?.length) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    const result = {};
    let totalBoys = 0;
    let totalGirls = 0;
    let totalStudents = 0;

    for (const row of studentRows) {
      const { category, boys, girls, total } = row;
      result[category] = {
        boys,
        girls,
        total,
        remarks: ""
      };
      totalBoys += boys;
      totalGirls += girls;
      totalStudents += total;
    }

    result["TOTAL"] = {
      boys: totalBoys,
      girls: totalGirls,
      total: totalStudents,
      remarks: "Verified"
    };

    return res.status(200).json({ success: true, result });
  } catch (error) {
    console.error("Error in categoryList controller:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};
