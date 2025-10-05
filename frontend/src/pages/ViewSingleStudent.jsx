import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import NavInsideBar from "../components/NavInsideBar";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Document, Packer, Paragraph, TextRun } from "docx";

const ViewSingleStudent = () => {
  const { student_uid } = useParams();
  const { backendUrl } = useContext(AppContent);
  const [data, setData] = useState(null);

  // -------- Fetch Student Full Data --------
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/roles/viewStudentData/${student_uid}`,
          { withCredentials: true }
        );
        if (data.success) {
          setData(data);
        } else toast.error(data.message);
      } catch (error) {
        toast.error("Error fetching student: " + error.message);
      }
    };
    fetchData();
  }, [backendUrl, student_uid]);

  if (!data)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 flex items-center justify-center">
        <p className="text-slate-600 text-lg sm:text-xl">
          Loading student data...
        </p>
      </div>
    );

  const student = data.student;
  const fees = data.student_fees?.[0] || {};
  const attendance = data.student_attendance?.[0] || {};
  const semesters = data.student_semesters?.[0] || {};

  // -------- Helper data builders --------
  const personalDetails = [
    ["Student UID", student.student_uid],
    ["Name", student.name],
    ["Email", student.email],
    ["DOB", student.dob?.split("T")[0]],
    ["Father's Name", student.fatherName],
    ["Father's Occupation", student.fatherOccupation],
    ["Mother's Name", student.motherName],
    ["Mother's Occupation", student.motherOccupation],
    ["Medium of Instruction", student.mediumOfInstruction],
    ["Marks Scored", student.marksScored],
    ["Percentage", student.percentage],
    ["School Name & Place", student.schoolNamePlace],
    ["Religion", student.religion],
    ["Nationality", student.nationality],
    ["Category", student.category],
    ["Date of Admission", student.dateOfAdmission?.split("T")[0]],
    ["Date of Leaving", student.dateOfLeaving?.split("T")[0] || "—"],
    ["Aadhaar", student.aadhaar],
    ["Contact No", student.contactNo],
    ["Address", student.address],
    ["Gender", student.gender],
    ["Course", student.course],
    ["Year", student.year],
    ["Blood Group", student.bloodGroup],
    ["Scholarship Details", student.scholarshipDetails],
  ];

  const semesterRows = [...Array(8)].map((_, i) => ({
    sem: `Semester ${i + 1}`,
    examFees: semesters[`examfeesSem${i + 1}`] || "—",
    gpa: semesters[`gpaSem${i + 1}`] || "—",
    cgpa: semesters[`cgpaSem${i + 1}`] || "—",
    marksheet: semesters[`marksheetSem${i + 1}`] || "—",
  }));

  const feesTable = [
    ["Year 1", fees.feesYear1 || "—"],
    ["Year 2", fees.feesYear2 || "—"],
    ["Year 3", fees.feesYear3 || "—"],
    ["Year 4", fees.feesYear4 || "—"],
  ];

  const attendanceTable = [
    ["Sem 1", attendance.attendanceSem1 || "—"],
    ["Sem 2", attendance.attendanceSem2 || "—"],
    ["Sem 3", attendance.attendanceSem3 || "—"],
    ["Sem 4", attendance.attendanceSem4 || "—"],
    ["Sem 5", attendance.attendanceSem5 || "—"],
    ["Sem 6", attendance.attendanceSem6 || "—"],
    ["Sem 7", attendance.attendanceSem7 || "—"],
    ["Sem 8", attendance.attendanceSem8 || "—"],
  ];

  // -------- Exports --------
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("PERUNTHALAIVAR KAMARAJAR ARTS COLLEGE", 105, 20, { align: "center" });
    doc.setFontSize(12);
    doc.text("Department of Commerce", 105, 28, { align: "center" });
    doc.setFontSize(13);
    doc.text("STUDENT FULL PROFILE", 105, 38, { align: "center" });

    autoTable(doc, {
      startY: 45,
      head: [["Field", "Information"]],
      body: personalDetails,
      theme: "grid",
    });

    doc.text("Fees Details", 14, doc.lastAutoTable.finalY + 10);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 15,
      head: [["Year", "Fees Amount"]],
      body: feesTable,
      theme: "grid",
    });

    doc.text("Attendance Details", 14, doc.lastAutoTable.finalY + 10);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 15,
      head: [["Semester", "Attendance %"]],
      body: attendanceTable,
      theme: "grid",
    });

    doc.text("Semester Details", 14, doc.lastAutoTable.finalY + 10);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 15,
      head: [["Semester", "Exam Fees", "GPA", "CGPA", "Marksheet"]],
      body: semesterRows.map((s) => [s.sem, s.examFees, s.gpa, s.cgpa, s.marksheet]),
      theme: "grid",
    });

    doc.save(`${student.name}_Full_Profile.pdf`);
  };

  const downloadExcel = () => {
    const wb = XLSX.utils.book_new();

    const sheets = {
      "Personal Details": personalDetails,
      "Fees Details": feesTable,
      "Attendance": attendanceTable,
      "Semesters": semesterRows.map((s) => [
        s.sem,
        s.examFees,
        s.gpa,
        s.cgpa,
        s.marksheet,
      ]),
    };

    for (const [name, data] of Object.entries(sheets)) {
      const ws = XLSX.utils.aoa_to_sheet([["Field", "Value"], ...data]);
      XLSX.utils.book_append_sheet(wb, ws, name);
    }

    XLSX.writeFile(wb, `${student.name}_Full_Profile.xlsx`);
  };

  const downloadWord = async () => {
    const paragraphs = [
      new Paragraph({
        children: [
          new TextRun({
            text: "PERUNTHALAIVAR KAMARAJAR ARTS COLLEGE",
            bold: true,
            size: 28,
          }),
        ],
        alignment: "center",
      }),
      new Paragraph({
        children: [new TextRun("Department of Commerce")],
        alignment: "center",
      }),
      new Paragraph({
        children: [new TextRun({ text: "STUDENT FULL PROFILE", bold: true })],
        alignment: "center",
        spacing: { after: 300 },
      }),
    ];

    const addSection = (title, arr) => {
      paragraphs.push(
        new Paragraph({
          children: [new TextRun({ text: `\n${title}`, bold: true, size: 24 })],
        })
      );
      arr.forEach(([k, v]) =>
        paragraphs.push(
          new Paragraph({
            children: [
              new TextRun({ text: `${k}: `, bold: true }),
              new TextRun(v ? String(v) : "—"),
            ],
          })
        )
      );
    };

    addSection("Personal Details", personalDetails);
    addSection("Fees Details", feesTable);
    addSection("Attendance Details", attendanceTable);

    paragraphs.push(
      new Paragraph({ children: [new TextRun({ text: "\nSemester Details", bold: true })] })
    );
    semesterRows.forEach((s) =>
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${s.sem}: `, bold: true }),
            new TextRun(
              `Exam Fees: ${s.examFees}, GPA: ${s.gpa}, CGPA: ${s.cgpa}, Marksheet: ${s.marksheet}`
            ),
          ],
        })
      )
    );

    const doc = new Document({ sections: [{ children: paragraphs }] });
    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${student.name}_Full_Profile.docx`);
  };

  // -------- UI --------
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300">
      <NavInsideBar />
      <div className="flex flex-col items-center pt-8 px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2 text-center">
          Student Full Details
        </h2>
        <p className="text-slate-500 mb-6 text-center">
          Detailed record for <span className="font-semibold">{student.name}</span>
        </p>

        {/* Export Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={downloadPDF}
            className="bg-slate-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-slate-800 transition cursor-pointer text-sm"
          >
            Download PDF
          </button>
          <button
            onClick={downloadExcel}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-500 transition cursor-pointer text-sm"
          >
            Download Excel
          </button>
          <button
            onClick={downloadWord}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-500 transition cursor-pointer text-sm"
          >
            Download Word
          </button>
        </div>

        {/* Student Card */}
        <div className="bg-white shadow-2xl rounded-xl p-6 sm:p-10 w-full max-w-5xl mb-10">
          {student.photo && (
            <div className="flex justify-center mb-6">
              <img
                src={`${backendUrl}/api/upload/${student.photo}`}
                alt="Student"
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-slate-200"
              />
            </div>
          )}

          {/* Personal */}
          <Section title="Personal Details" data={personalDetails} />

          {/* Fees Table */}
          <TableSection title="Fees Details" headers={["Year", "Fees Amount"]} rows={feesTable} />

          {/* Attendance Table */}
          <TableSection title="Attendance Details" headers={["Semester", "Attendance %"]} rows={attendanceTable} />

          {/* Semester Table */}
          <SemesterSection title="Semester Details" data={semesterRows} />
        </div>
      </div>
    </div>
  );
};

// -------- Reusable Components --------
const Section = ({ title, data }) => (
  <div className="mb-8">
    <h3 className="text-lg font-bold text-slate-800 mb-3">{title}</h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
      {data.map(([label, value], i) => (
        <div key={i}>
          <p className="text-xs sm:text-sm text-slate-500">{label}</p>
          <p className="text-sm sm:text-base font-semibold text-slate-800 border-b border-slate-200 pb-1 break-words">
            {value}
          </p>
        </div>
      ))}
    </div>
  </div>
);

const TableSection = ({ title, headers, rows }) => (
  <div className="mb-8">
    <h3 className="text-lg font-bold text-slate-800 mb-3">{title}</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full border border-slate-300 text-sm text-slate-700">
        <thead className="bg-slate-200">
          <tr>
            {headers.map((head, idx) => (
              <th key={idx} className="px-4 py-2 border">
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((cell, j) => (
                <td key={j} className="border px-4 py-2 text-center">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

const SemesterSection = ({ title, data }) => (
  <div>
    <h3 className="text-lg font-bold text-slate-800 mb-3">{title}</h3>
    <div className="overflow-x-auto">
      <table className="min-w-full border border-slate-300 text-sm text-slate-700">
        <thead className="bg-slate-200">
          <tr>
            <th className="px-4 py-2 border">Semester</th>
            <th className="px-4 py-2 border">Exam Fees</th>
            <th className="px-4 py-2 border">GPA</th>
            <th className="px-4 py-2 border">CGPA</th>
            <th className="px-4 py-2 border">Marksheet</th>
          </tr>
        </thead>
        <tbody>
          {data.map((s, i) => (
            <tr key={i}>
              <td className="border px-4 py-2 text-center">{s.sem}</td>
              <td className="border px-4 py-2 text-center">{s.examFees}</td>
              <td className="border px-4 py-2 text-center">{s.gpa}</td>
              <td className="border px-4 py-2 text-center">{s.cgpa}</td>
              <td className="border px-4 py-2 text-center">{s.marksheet}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default ViewSingleStudent;
