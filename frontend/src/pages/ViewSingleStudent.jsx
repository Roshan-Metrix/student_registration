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
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/roles/viewStudentData/${student_uid}`,
          { withCredentials: true }
        );
        if (data.success) setStudent(data.student);
        else toast.error(data.message);
      } catch (error) {
        toast.error("Error fetching student: " + error.message);
      }
    };
    fetchStudent();
  }, [backendUrl, student_uid]);

  const getDetailsArray = () => [
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
    ["Date of Leaving", student.dateOfLeaving?.split("T")[0]],
    ["Aadhaar", student.aadhaar],
    ["Contact No", student.contactNo],
    ["Address", student.address],
    ["Gender", student.gender],
    ["Course", student.course],
    ["Year", student.year],
    ["Blood Group", student.bloodGroup],
    ["Scholarship Details", student.scholarshipDetails],
  ].filter(Boolean);

  // PDF Export
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("PERUNTHALAIVAR KAMARAJAR ARTS COLLEGE", 105, 20, {
      align: "center",
    });
    doc.setFontSize(12);
    doc.text("Department of Commerce", 105, 28, { align: "center" });
    doc.setFontSize(13);
    doc.text("STUDENTS PROFILE", 105, 38, { align: "center" });

    autoTable(doc, {
      startY: 45,
      head: [["Details", "Information"]],
      body: getDetailsArray(),
      theme: "grid",
    });

    doc.save(`${student.name}_details.pdf`);
  };

  // Excel Export
  const downloadExcel = () => {
    const ws = XLSX.utils.aoa_to_sheet([["Details", "Information"], ...getDetailsArray()]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Student Details");
    XLSX.writeFile(wb, `${student.name}_details.xlsx`);
  };

  // Word Export
  const downloadWord = async () => {
    const doc = new Document({
      sections: [
        {
          children: [
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
              children: [new TextRun({ text: "STUDENT PROFILE", bold: true })],
              alignment: "center",
              spacing: { after: 300 },
            }),
            ...getDetailsArray().map(
              ([field, value]) =>
                new Paragraph({
                  children: [
                    new TextRun({ text: `${field}: `, bold: true }),
                    new TextRun(value ? String(value) : "—"),
                  ],
                })
            ),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${student.name}_details.docx`);
  };

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 flex items-center justify-center">
        <p className="text-slate-600 text-lg sm:text-xl">
          Loading student data...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300">
      <NavInsideBar />
      <div className="flex flex-col items-center pt-8 px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2 text-center">
          Student Details
        </h2>
        <p className="text-slate-500 mb-6 text-center">
          Detailed record for{" "}
          <span className="font-semibold">{student.name}</span>
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
        <div className="bg-white shadow-2xl rounded-xl p-6 sm:p-10 w-full max-w-4xl mb-10">
          {student.photo && (
            <div className="flex justify-center mb-6">
              <img
                src={`${backendUrl}/api/upload/${student.photo}`}
                alt="Student"
                className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-slate-200"
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {getDetailsArray().map(([label, value], idx) => (
              <Detail key={idx} label={label} value={value} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Detail = ({ label, value }) => (
  <div>
    <p className="text-xs sm:text-sm text-slate-500">{label}</p>
    <p className="text-sm sm:text-base font-semibold text-slate-800 border-b border-slate-200 pb-1 break-words">
      {value || "—"}
    </p>
  </div>
);

export default ViewSingleStudent;
