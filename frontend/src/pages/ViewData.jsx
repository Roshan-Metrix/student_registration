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

  const handleView = (student_uid) => {
    navigate(`/student/${student_uid}`);
  };

  const handleEdit = (student_uid) => {
    navigate(`/student/edit/${student_uid}`);
  };

  const handleDelete = async (student_uid) => {
    if (!window.confirm("Are you sure you want to delete this student?"))
      return;

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

  // Search filter
  const filteredStudents = students.filter((student) =>
<<<<<<< HEAD
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.student_uid.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
=======
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
>>>>>>> e87781ca56b4ef120b138ba52d5bb9b5634791cc
  );

  // Pagination logic
  const indexOfLast = currentPage * studentsPerPage;
  const indexOfFirst = indexOfLast - studentsPerPage;
  const currentStudents = filteredStudents.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredStudents.length / studentsPerPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300">
      <NavInsideBar />
      <div className="flex flex-col items-center pt-5 w-full">
        {/* Title + Search */}
        <div className="flex justify-between items-center w-full max-w-6xl mb-2 px-2">
          <div>
            <h2 className="text-3xl font-bold text-slate-800 pl-10">
              Student Records
            </h2>
            <p className="text-slate-500 pl-10">All registered students data</p>
          </div>

          {/* Search Bar */}
          <div className="relative w-72">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              🔍
            </span>
            <input
              type="text"
<<<<<<< HEAD
              placeholder="Search by name, email or UID..."
=======
              placeholder="Search by name..."
>>>>>>> e87781ca56b4ef120b138ba52d5bb9b5634791cc
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // reset to first page on new search
              }}
              className="pl-10 pr-4 py-2 w-full border border-slate-300 rounded-lg shadow-sm 
                         focus:outline-none focus:ring-2 focus:ring-slate-600 focus:border-slate-600 
                         transition duration-200"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white shadow-2xl rounded-xl p-6 w-full max-w-6xl mb-10">
          <table className="table-auto w-full border-collapse border border-slate-300">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-4 py-2 border border-slate-300">
                  Student UID
                </th>
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
                    <td className="px-4 py-2 border border-slate-300">
                      {student.year}
                    </td>
                    <td className="px-4 py-2 border border-slate-300 flex gap-2 justify-center">
                      <button
                        onClick={() => handleView(student.student_uid)}
                        className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-500 cursor-pointer"
                      >
                        View All
                      </button>
                      <button
                        onClick={() => handleEdit(student.student_uid)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-400 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student.student_uid)}
                        className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-500 cursor-pointer"
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg border border-slate-300 transition ${
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
                className={`px-4 py-2 rounded-lg border border-slate-300 transition ${
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
