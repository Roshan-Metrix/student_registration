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

const YearCategory = () => {
  const { backendUrl } = useContext(AppContent);
  const { year } = useParams(); // e.g., "1stYear"
  const [data, setData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const yearNumber = parseInt(year, 10); // Extract numeric part of year
        const { data } = await axios.get(
          // `${backendUrl}/api/filter/category/${yearNumber}`,
          `${backendUrl}/api/filter/category/${year}`,
          { withCredentials: true }
        );
        if (data.success) {
          setData(data.result || {});
        } else {
          toast.error(data.message || "No data found");
          setData({});
        }
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
        setData({});
      }
    };

    fetchData();
  }, [backendUrl, year]);

  // Convert backend object into rows for table/PDF/Excel/Word
  const rows = Object.entries(data).map(([category, values]) => ({
    category,
    boys: values?.boys || 0,
    girls: values?.girls || 0,
    total: values?.total || 0,
    remarks: values?.remarks || "—",
  }));

  // Download PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`${year} - Category Wise Student Report`, 105, 20, {
      align: "center",
    });

    const body = rows.map((row) => [
      row.category,
      row.boys,
      row.girls,
      row.total,
      row.remarks,
    ]);

    autoTable(doc, {
      startY: 30,
      head: [["Category", "Boys", "Girls", "Total", "Remarks"]],
      body,
      theme: "grid",
    });

    doc.save(`${year}_Category_Report.pdf`);
  };

  // Download Excel
  const downloadExcel = () => {
    const ws = XLSX.utils.json_to_sheet(rows, {
      header: ["category", "boys", "girls", "total", "remarks"],
    });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Category Report");
    XLSX.writeFile(wb, `${year}_Category_Report.xlsx`);
  };

  // Download Word
  const downloadWord = async () => {
    const tableRows = [
      new TableRow({
        children: ["Category", "Boys", "Girls", "Total", "Remarks"].map(
          (header) =>
            new TableCell({
              children: [
                new Paragraph({ children: [new TextRun({ text: header, bold: true })] }),
              ],
            })
        ),
      }),
      ...rows.map(
        (row) =>
          new TableRow({
            children: [
              row.category,
              row.boys.toString(),
              row.girls.toString(),
              row.total.toString(),
              row.remarks?.toString() || "—",
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
                new TextRun({ text: "DEPARTMENT OF COMMERCE", bold: true, size: 28 }),
              ],
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              children: [
                new TextRun({
                  text: `${year} - Category Wise Student Report`,
                  bold: true,
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),
            new Table({ rows: tableRows }),
          ],
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `${year}_Category_Report.docx`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300">
      <NavInsideBar />
      <div className="px-20 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">
            DEPARTMENT OF COMMERCE{" "}
            <span className="font-normal text-[20px] block">
              {year} - Category Wise Student Report
            </span>
          </h2>

          <div className="flex gap-3">
            <button
              onClick={downloadPDF}
              className="bg-slate-900 text-white px-4 py-2 rounded-lg font-semibold hover:bg-slate-800 transition"
            >
              PDF
            </button>
            <button
              onClick={downloadExcel}
              className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-green-500 transition"
            >
              Excel
            </button>
            <button
              onClick={downloadWord}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-500 transition"
            >
              Word
            </button>
          </div>
        </div>

        <div className="bg-white shadow-2xl rounded-xl overflow-hidden">
          {rows.length > 0 ? (
            <table className="min-w-full border border-slate-300 text-sm text-slate-700">
              <thead className="bg-slate-900 text-white">
                <tr>
                  <th className="px-6 py-3 text-left">Category</th>
                  <th className="px-6 py-3 text-center">Boys</th>
                  <th className="px-6 py-3 text-center">Girls</th>
                  <th className="px-6 py-3 text-center">Total</th>
                  <th className="px-6 py-3 text-center">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr
                    key={idx}
                    className="border-b border-slate-200 hover:bg-slate-50"
                  >
                    <td className="px-6 py-3 font-medium">{row.category}</td>
                    <td className="px-6 py-3 text-center">{row.boys}</td>
                    <td className="px-6 py-3 text-center">{row.girls}</td>
                    <td className="px-6 py-3 text-center">{row.total}</td>
                    <td className="px-6 py-3 text-center">{row.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-slate-500 py-10 italic">
              No data available for {year}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default YearCategory;
