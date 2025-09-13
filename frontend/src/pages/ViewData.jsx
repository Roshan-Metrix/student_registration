import React, { useEffect, useState, useContext } from "react";
import NavInsideBar from "../components/NavInsideBar";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ViewData = () => {
  const { backendUrl } = useContext(AppContent);
  const [students, setStudents] = useState([]);
  const navigate = useNavigate();

  const handleView = (student_uid) => {
    navigate(`/student/${student_uid}`);
  }

  const handleEdit = (student_uid) => {
    navigate(`/student/edit/${student_uid}`);
  }

  const handleDelete = async (student_uid) => {
  if (!window.confirm("Are you sure you want to delete this student?")) return;

  try {
    const { data } = await axios.delete(
      `${backendUrl}/api/roles/deleteStudent/${student_uid}`,
      { withCredentials: true }
    );

    if (data.success) {
      toast.success(data.message);
      // refresh data after deletion
      setStudents((prev) =>
        prev.filter((student) => student.student_uid !== student_uid)
      );
    } else {
      toast.error(data.message);
    }
  } catch (error) {
    toast.error(error.message);
  }
};

  // fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data } = await axios.get(
          backendUrl + "/api/roles/getStudentsData",
          { withCredentials: true }
        );
        if (data.success) {
          setStudents(data.students || []);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Error fetching students: " + error.message);
      }
    };
    fetchStudents();
  }, [backendUrl]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300">
      <NavInsideBar />
      <div className="flex flex-col items-center pt-12">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">
          Student Records
        </h2>
        <p className="text-slate-500 mb-6">All registered students data</p>

        <div className="bg-white shadow-2xl rounded-xl p-6 w-full max-w-5xl">
          <table className="table-auto w-full border-collapse border border-slate-300">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-4 py-2 border border-slate-300">Student UID</th>
                <th className="px-4 py-2 border border-slate-300">Name</th>
                <th className="px-4 py-2 border border-slate-300">Email</th>
                <th className="px-4 py-2 border border-slate-300">Category</th>
                <th className="px-4 py-2 border border-slate-300">DOB</th>
                <th className="px-4 py-2 border border-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length > 0 ? (
                students.map((student, index) => (
                  <tr
                    key={index}
                    className="hover:bg-slate-100 transition-colors"
                  >
                    <td className="px-4 py-2 border border-slate-300 text-center">
                      {student.student_uid}
                    </td>
                    <td className="px-4 py-2 border border-slate-300">
                      {student.name}
                    </td>
                    <td className="px-4 py-2 border border-slate-300">
                      {student.email}
                    </td>
                    <td className="px-4 py-2 border border-slate-300">
                      {student.category}
                    </td>
                    <td className="px-4 py-2 border border-slate-300">
                      {student.dob}
                    </td>
                    <td className="px-4 py-2 border border-slate-300 flex gap-2 justify-center">
                      <button
                        onClick={() =>
                          handleView(student.student_uid)
                        }
                        className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-500"
                      >
                        View All
                      </button>
                      <button
                        onClick={() =>
                          handleEdit(student.student_uid)
                        }
                        className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-400"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student.student_uid)}
                        className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-500"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="text-center py-4 text-slate-500 italic"
                  >
                    No students found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewData;
