import React, { useState, useEffect, useContext } from "react";
import NavInsideBar from "../components/NavInsideBar";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const PrintData = () => {
  const { backendUrl } = useContext(AppContent);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  // const [hostellerFilter, setHostellerFilter] = useState("");

  // Fetch all students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data } = await axios.get(
          backendUrl + "/api/roles/getStudentsData",
          { withCredentials: true }
        );
        if (data.success) {
          setStudents(data.students || []);
          setFilteredStudents(data.students || []);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Error fetching students: " + error.message);
      }
    };
    fetchStudents();
  }, [backendUrl]);

  // Unique courses dynamically from data
  const uniqueCourses = [...new Set(students.map((s) => s.course))];

  // Filtering logic
useEffect(() => {
  let filtered = students;

  // Multi-search
  if (searchQuery) {
    const searchTerms = searchQuery
      .split(",") // split by comma
      .map((term) => term.trim().toLowerCase()) // clean terms
      .filter((term) => term.length > 0);

    filtered = filtered.filter((s) =>
      searchTerms.some(
        (term) =>
          s.name.toLowerCase().includes(term) ||
          s.email.toLowerCase().includes(term) ||
          s.student_uid.toLowerCase().includes(term)
      )
    );
  }

  // Category
  if (categoryFilter) {
    filtered = filtered.filter((s) => s.category === categoryFilter);
  }

  // Year
  if (yearFilter) {
    filtered = filtered.filter((s) => String(s.year) === yearFilter);
  }

  // Course
  if (courseFilter) {
    filtered = filtered.filter((s) => s.course === courseFilter);
  }

  // Hosteller
  // if (hostellerFilter) {
  //   filtered = filtered.filter((s) => s.hosteller === hostellerFilter);
  // }

  setFilteredStudents(filtered);
}, [searchQuery, categoryFilter, yearFilter, courseFilter, students]);


  // Download filtered data as PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Filtered Student Data", 14, 20);

    const body = filteredStudents.map((s) => [
      s.student_uid,
      s.name,
      s.email,
      s.category,
      s.year,
      s.course,
    ]);

    autoTable(doc, {
      startY: 30,
      head: [["UID", "Name", "Email", "Category", "Year", "Course"]],
      body,
      theme: "grid",
    });

    doc.save("Filtered_Students.pdf");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300">
      <NavInsideBar />
      <div className="px-20 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            Filter Students Datas
          </h2>
          <button
            onClick={downloadPDF}
            className="bg-slate-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-slate-800 transition"
          >
            Download PDF
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by name, email or UID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-slate-500 outline-none"
          />

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg w-full shadow-sm"
          >
            <option value="">All Categories</option>
            <option value="FC">FC</option>
            <option value="BC">BC</option>
            <option value="OBC">OBC</option>
            <option value="MBC">MBC</option>
            <option value="BCM">BCM</option>
            <option value="EBC">EBC</option>
            <option value="SC">SC</option>
          </select>

          {/* Year */}
          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg w-full shadow-sm"
          >
            <option value="">All Years</option>
            <option value="1">1st Year</option>
            <option value="2">2nd Year</option>
            <option value="3">3rd Year</option>
            <option value="4">4th Year</option>
          </select>

          {/* Course */}
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg w-full shadow-sm"
          >
            <option value="">All Courses</option>
            {uniqueCourses.map((course, i) => (
              <option key={i} value={course}>
                {course}
              </option>
            ))}
          </select>

          {/* Hosteller */}
          {/* <select
            value={hostellerFilter}
            onChange={(e) => setHostellerFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg w-full shadow-sm"
          >
            <option value="">Hosteller: All</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select> */}
        </div>

        {/* Table */}
        <div className="bg-white shadow-2xl rounded-xl overflow-hidden">
          <table className="min-w-full border border-slate-300 text-sm text-slate-700">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-6 py-3 text-left">UID</th>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-center">Category</th>
                <th className="px-6 py-3 text-center">Year</th>
                <th className="px-6 py-3 text-center">Course</th>
                {/* <th className="px-6 py-3 text-center">Hosteller</th> */}
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((s, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-200 hover:bg-slate-50"
                  >
                    <td className="px-6 py-3">{s.student_uid}</td>
                    <td className="px-6 py-3">{s.name}</td>
                    <td className="px-6 py-3">{s.email}</td>
                    <td className="px-6 py-3 text-center">{s.category}</td>
                    <td className="px-6 py-3 text-center">{s.year}</td>
                    <td className="px-6 py-3 text-center">{s.course}</td>
                    {/* <td className="px-6 py-3 text-center">{s.hosteller}</td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-6 text-slate-500 italic"
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

export default PrintData;
