import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import NavInsideBar from "../components/NavInsideBar";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const YearCategory = () => {
  const { backendUrl } = useContext(AppContent);
  const { year } = useParams(); // e.g., 1stYear
  const [data, setData] = useState({});

  // Extract only the first digit (year number)
  const yearNumber = parseInt(year, 10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/filter/category/${yearNumber}`,
          { withCredentials: true }
        );
        if (data.success) {
          setData(data.result);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchData();
  }, [backendUrl, yearNumber]);

  // Convert backend object into rows for table/PDF
  const rows = Object.entries(data).map(([category, values]) => ({
    category,
    boys: values.boys || 0,
    girls: values.girls || 0,
    total: values.total || 0,
    remarks: values.remarks || "—",
  }));

  // Download PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`${year} - Category Wise Student Report`, 14, 20);

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
          <button
            onClick={downloadPDF}
            className="bg-slate-900 text-white px-6 py-2 rounded-lg font-semibold hover:bg-slate-800 transition"
          >
            Download PDF
          </button>
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
