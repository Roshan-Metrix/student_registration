import React, { useEffect, useState, useContext } from "react";
import NavInsideBar from "../components/NavInsideBar";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ViewData = () => {
  const { backendUrl } = useContext(AppContent);
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 10;
  const navigate = useNavigate();
   axios.defaults.withCredentials = true;

  const handleView = (student_uid) => navigate(`/student/${student_uid}`);
  const handleEdit = (student_uid) => navigate(`/student/edit/${student_uid}`);

  const handleDelete = async (student_uid) => {
   
    if (!window.confirm("Are you sure you want to delete this student?")) return;

    try {
      const { data } = await axios.delete(
        `${backendUrl}/api/roles/deleteStudent/${student_uid}`,
        { withCredentials: true }
      );

      if (data.success) {
        toast.success(data.message);
        setStudents((prev) =>
          prev.filter((student) => student.student_uid !== student_uid)
        );
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data } = await axios.get(
          backendUrl + "/api/roles/getStudentsData",
          { withCredentials: true }
        );
        if (data.success) setStudents(data.students || []);
        else toast.error(data.message);
      } catch (error) {
        toast.error("Error fetching students: " + error.message);
      }
    };
    fetchStudents();
  }, [backendUrl]);

const filteredStudents = students.filter((student) => {
  const name = student.name || "";
  const uid = student.student_uid || "";
  const email = student.email || "";
  const year = student.year || "";
  const category = student.category || "";

  return (
    name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    uid.toLowerCase().includes(searchQuery.toLowerCase()) ||
    email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    year.toString().includes(searchQuery.toLowerCase()) ||
    category.toLowerCase().includes(searchQuery.toLowerCase())
  );
});


  const indexOfLast = currentPage * studentsPerPage;
  const indexOfFirst = indexOfLast - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300">
      <NavInsideBar />
      <div className="flex flex-col items-center pt-6 w-full px-4 sm:px-8">
        {/* Title + Search */}
        <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-6xl mb-4 gap-4">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800">
              Student Records
            </h2>
            <p className="text-slate-500">All registered students data</p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-72">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search by name, email or UID..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-lg shadow-sm 
                         focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-slate-600 
                         transition duration-200"
            />
          </div>
        </div>

        {/* Table Wrapper */}
        <div className="bg-white shadow-2xl rounded-xl p-4 sm:p-6 w-full max-w-6xl mb-10 overflow-x-auto">
          <table className="table-auto w-full border-collapse border border-slate-300 text-sm sm:text-base">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-4 py-2 border border-slate-300">UID</th>
                <th className="px-4 py-2 border border-slate-300">Name</th>
                <th className="px-4 py-2 border border-slate-300">Email</th>
                <th className="px-4 py-2 border border-slate-300">Category</th>
                <th className="px-4 py-2 border border-slate-300">Year</th>
                <th className="px-4 py-2 border border-slate-300">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.length > 0 ? (
                currentStudents.map((student, index) => (
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
                    <td className="px-4 py-2 border border-slate-300 text-center">
                      {student.year}
                    </td>
                    <td className="px-4 py-2 border border-slate-300">
                      <div className="flex flex-wrap gap-2 justify-center">
                        <button
                          onClick={() => handleView(student.student_uid)}
                          className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-500 text-xs sm:text-sm"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleEdit(student.student_uid)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-400 text-xs sm:text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(student.student_uid)}
                          className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-500 text-xs sm:text-sm"
                        >
                          Delete
                        </button>
                      </div>
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-wrap justify-center items-center gap-3 mt-6 text-sm sm:text-base">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg border transition ${
                  currentPage === 1
                    ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                    : "bg-slate-900 text-white hover:bg-slate-700"
                }`}
              >
                Prev
              </button>
              <span className="text-slate-700 font-medium">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg border transition ${
                  currentPage === totalPages
                    ? "bg-slate-200 text-slate-500 cursor-not-allowed"
                    : "bg-slate-900 text-white hover:bg-slate-700"
                }`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ViewData;
