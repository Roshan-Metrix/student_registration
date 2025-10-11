import React, { useState, useEffect, useContext } from "react";
import NavInsideBar from "../components/NavInsideBar";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import {
  Document,
  Packer,
  Paragraph,
  Table,
  TableRow,
  TableCell,
  TextRun,
  AlignmentType,
} from "docx";

const PrintData = () => {
  const { backendUrl } = useContext(AppContent);
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [courseFilter, setCourseFilter] = useState("");
  const [courses, setCourses] = useState([]);
  const [years, setYears] = useState([]);

  //  Fetch all students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/roles/getStudentsData`,
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

  //  Fetch all distinct courses and years (from backend)
  useEffect(() => {
    const fetchCoursesAndYears = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/roles/get-courses-years`,
          { withCredentials: true }
        );

        if (data.success) {
          setCourses(data.courses || []);
          setYears(data.years || []);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Failed to fetch courses/years: " + error.message);
      }
    };
    fetchCoursesAndYears();
  }, [backendUrl]);

  // Filtering logic
  useEffect(() => {
    let filtered = students;

    // 🔍 Multi-search
    if (searchQuery) {
      const searchTerms = searchQuery
        .split(",")
        .map((term) => term.trim().toLowerCase())
        .filter((term) => term.length > 0);

      filtered = filtered.filter((s) =>
        searchTerms.some(
          (term) =>
            s.name?.toLowerCase().includes(term) ||
            s.email?.toLowerCase().includes(term) ||
            s.student_uid?.toLowerCase().includes(term)
        )
      );
    }

    if (categoryFilter) {
      filtered = filtered.filter((s) => s.category === categoryFilter);
    }

    if (yearFilter) {
      filtered = filtered.filter((s) => String(s.year) === yearFilter);
    }

    if (courseFilter) {
      filtered = filtered.filter((s) => s.course === courseFilter);
    }

    setFilteredStudents(filtered);
  }, [searchQuery, categoryFilter, yearFilter, courseFilter, students]);

  //  Download PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("PERUNTHALAIVAR KAMARAJAR ARTS COLLEGE", 105, 15, { align: "center" });
    doc.setFontSize(12);
    doc.text("Filtered Student Data", 105, 25, { align: "center" });

    const body = filteredStudents.map((s) => [
      s.student_uid,
      s.name,
      s.email,
      s.category,
      s.year,
      s.course,
    ]);

    autoTable(doc, {
      startY: 35,
      head: [["UID", "Name", "Email", "Category", "Year", "Course"]],
      body,
      theme: "grid",
    });

    doc.save("Filtered_Students.pdf");
  };

  // 📊 Download Excel
  const downloadExcel = () => {
    const rows = filteredStudents.map((s) => ({
      UID: s.student_uid,
      Name: s.name,
      Email: s.email,
      Category: s.category,
      Year: s.year,
      Course: s.course,
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "Filtered_Students.xlsx");
  };

  // 📄 Download Word
  const downloadWord = async () => {
    const tableRows = [
      new TableRow({
        children: ["UID", "Name", "Email", "Category", "Year", "Course"].map(
          (header) =>
            new TableCell({
              children: [
                new Paragraph({
                  children: [new TextRun({ text: header, bold: true })],
                }),
              ],
            })
        ),
      }),
      ...filteredStudents.map(
        (s) =>
          new TableRow({
            children: [
              s.student_uid,
              s.name,
              s.email,
              s.category,
              s.year?.toString() || "",
              s.course,
            ].map(
              (val) =>
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun(val)] })],
                })
            ),
          })
      ),
    ];

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
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
            }),
            new Paragraph({
              children: [new TextRun({ text: "Filtered Student Data", bold: true, size: 24 })],
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),
            new Table({ rows: tableRows }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, "Filtered_Students.docx");
  };

  // 🧠 UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300">
      <NavInsideBar />
      <div className="px-6 md:px-20 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Filter Students Data</h2>
          <div className="flex gap-3">
            <button onClick={downloadPDF} className="bg-slate-900 text-white px-4 py-2 rounded-lg hover:bg-slate-800">
              PDF
            </button>
            <button onClick={downloadExcel} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500">
              Excel
            </button>
            <button onClick={downloadWord} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500">
              Word
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-md mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search by name, email or UID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg w-full shadow-sm focus:ring-2 focus:ring-slate-500 outline-none"
          />

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg w-full shadow-sm"
          >
            <option value="">All Categories</option>
            {["FC", "BC", "OBC", "MBC", "BCM", "EBC", "SC"].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg w-full shadow-sm"
          >
            <option value="">All Years</option>
            {years.map((y, i) => (
              <option key={i} value={y}>
                {y}
              </option>
            ))}
          </select>

          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            className="px-4 py-2 border border-slate-300 rounded-lg w-full shadow-sm"
          >
            <option value="">All Courses</option>
            {courses.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </select>
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
              </tr>
            </thead>
            <tbody>
              {filteredStudents.length > 0 ? (
                filteredStudents.map((s, idx) => (
                  <tr key={idx} className="border-b border-slate-200 hover:bg-slate-50">
                    <td className="px-6 py-3">{s.student_uid}</td>
                    <td className="px-6 py-3">{s.name}</td>
                    <td className="px-6 py-3">{s.email}</td>
                    <td className="px-6 py-3 text-center">{s.category}</td>
                    <td className="px-6 py-3 text-center">{s.year}</td>
                    <td className="px-6 py-3 text-center">{s.course}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-slate-500 italic">
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
