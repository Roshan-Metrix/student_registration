import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import NavInsideBar from "../components/NavInsideBar";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

    const details = [
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
      ["Hosteller", student.hosteller],
      student.hosteller === "Yes"
        ? ["Hosteller Detail", student.hostellerDetail]
        : null,
    ].filter(Boolean);

    autoTable(doc, {
      startY: 45,
      head: [["Field", "Value"]],
      body: details,
      theme: "grid",
    });

    doc.save(`${student.name}_details.pdf`);
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

        {/* Download Button */}
        <button
          onClick={downloadPDF}
          className="mb-6 bg-slate-900 text-white px-4 sm:px-6 py-2 rounded-lg font-semibold hover:bg-slate-800 transition cursor-pointer text-sm sm:text-base"
        >
          Download as PDF
        </button>

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
            <Detail label="Student UID" value={student.student_uid} />
            <Detail label="Name" value={student.name} />
            <Detail label="Email" value={student.email} />
            <Detail label="DOB" value={student.dob?.split("T")[0]} />
            <Detail label="Father's Name" value={student.fatherName} />
            <Detail label="Father's Occupation" value={student.fatherOccupation} />
            <Detail label="Mother's Name" value={student.motherName} />
            <Detail label="Mother's Occupation" value={student.motherOccupation} />
            <Detail label="Medium of Instruction" value={student.mediumOfInstruction} />
            <Detail label="Marks Scored" value={student.marksScored} />
            <Detail label="Percentage" value={student.percentage} />
            <Detail label="School Name & Place" value={student.schoolNamePlace} />
            <Detail label="Religion" value={student.religion} />
            <Detail label="Nationality" value={student.nationality} />
            <Detail label="Category" value={student.category} />
            <Detail label="Date of Admission" value={student.dateOfAdmission?.split("T")[0]} />
            <Detail label="Date of Leaving" value={student.dateOfLeaving?.split("T")[0]} />
            <Detail label="Aadhaar" value={student.aadhaar} />
            <Detail label="Contact No" value={student.contactNo} />
            <Detail label="Address" value={student.address} />
            <Detail label="Gender" value={student.gender} />
            <Detail label="Course" value={student.course} />
            <Detail label="Year" value={student.year} />
            <Detail label="Blood Group" value={student.bloodGroup} />
            <Detail label="Scholarship Details" value={student.scholarshipDetails} />
            {/* <Detail label="Hosteller" value={student.hosteller} />
            {student.hosteller === "Yes" && (
              <Detail label="Hosteller Detail" value={student.hostellerDetail} />
            )} */}
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
