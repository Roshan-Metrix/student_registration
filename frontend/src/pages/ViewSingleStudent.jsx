import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import NavInsideBar from "../components/NavInsideBar";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ViewSingleStudent = () => {
  const { student_uid } = useParams();
  const { backendUrl } = useContext(AppContent);
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const { data } = await axios.get(
          backendUrl + `/api/roles/viewStudentData/${student_uid}`,
          { withCredentials: true }
        );
        if (data.success) {
          setStudent(data.student);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Error fetching student: " + error.message);
      }
    };
    fetchStudent();
  }, [backendUrl, student_uid]);

  if (!student) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300 flex items-center justify-center">
        <p className="text-slate-600 text-xl">Loading student data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300">
      <NavInsideBar />
      <div className="flex flex-col items-center pt-12">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">
          Student Details
        </h2>
        <p className="text-slate-500 mb-6">
          Detailed record for {student.name}
        </p>

        <div className="bg-white shadow-2xl rounded-xl p-10 w-full max-w-4xl">
          {/* Photo */}
          {student.photo && (
            <div className="flex justify-center mb-6">
              <img
                src={`${backendUrl}/api/upload/${student.photo}`}
                alt="Student"
                className="w-32 h-32 rounded-full object-cover border-4 border-slate-200"
              />
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            <Detail label="Student UID" value={student.student_uid} />
            <Detail label="Name" value={student.name} />
            <Detail label="Email" value={student.email} />
            <Detail label="DOB" value={student.dob} />
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
            <Detail label="Date of Admission" value={student.dateOfAdmission} />
            <Detail label="Date of Leaving" value={student.dateOfLeaving} />
            <Detail label="Aadhaar" value={student.aadhaar} />
            <Detail label="Contact No" value={student.contactNo} />
            <Detail label="Address" value={student.address} />
            <Detail label="Gender" value={student.gender} />
            <Detail label="Course" value={student.course} />
            <Detail label="Year" value={student.year} />
            <Detail label="Blood Group" value={student.bloodGroup} />
            <Detail label="Scholarship Details" value={student.scholarshipDetails} />
            <Detail label="Hosteller" value={student.hosteller} />
            {student.hosteller === "Yes" && (
              <Detail label="Hosteller Detail" value={student.hostellerDetail} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Small component for consistent detail rendering
const Detail = ({ label, value }) => (
  <div>
    <p className="text-sm text-slate-500">{label}</p>
    <p className="text-base font-semibold text-slate-800 border-b border-slate-200 pb-1">
      {value || "—"}
    </p>
  </div>
);

export default ViewSingleStudent;
