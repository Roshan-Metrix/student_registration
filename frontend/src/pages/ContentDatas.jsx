import React, { useState, useEffect, useContext } from "react";
import NavInsideBar from "../components/NavInsideBar";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Reusable Input component
const Input = ({ label, name, type = "text", value, onChange, required, step, min, max }) => (
  <div>
    {label && <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>}
    <input
      className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      step={step}
      min={min}
      max={max}
    />
  </div>
);

// Reusable Select component
const Select = ({ label, name, value, onChange, options, required = false }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
    <select
      className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
      name={name}
      value={value}
      onChange={onChange}
      required={required}
    >
      <option value="">Select {label}</option>
      {options.map((opt, i) => (
        <option key={i} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

const ContentData = () => {
  const { backendUrl } = useContext(AppContent);
  const [step, setStep] = useState(1);
  const [studentUID, setStudentUID] = useState(null);
  const [formData, setFormData] = useState({});
  const [courses, setCourses] = useState([]); // dynamically loaded courses
  const [user, setUser] = useState(null);

  const sectionTitles = [
    "Batch Details",
    "Student Information",
    "Fee's Details",
    "Attendance Percentage",
    "Semester Table",
  ];

  // ✅ Fetch user details to determine course list
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/roles/user/data`, {
          withCredentials: true,
        });

        if (data.success) {
          setUser(data.userData);

          if (data.userData.role === "admin") {
            //  Admin sees all courses
            setCourses([
              "B.A (Tamil)",
              "B.Sc (Mathematics)",
              "B.B.A (Tourism)",
              "B.C.A (Computer Applications)",
              "B.Com",
            ]);
          } else if (data.userData.role === "staffs") {
            //  Staff sees only their department
            setCourses([data.userData.dept]);
          }
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
        toast.error("Failed to load user data");
      }
    };

    fetchUserData();
  }, [backendUrl]);

  // Input handler
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    let finalValue = value;

    if (name === "name") {
      finalValue = value
        .split(" ")
        .map((word) => word.toUpperCase())
        .join(" ");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : finalValue,
    }));
  };

  //  Step navigation
  const handleNext = async () => {
    if (step === 1 && (!formData.course || !formData.year)) {
      toast.error("Course and Year are compulsory!");
      return;
    }

    if (step === 2) {
      try {
        const studentForm = new FormData();
        Object.entries(formData).forEach(([key, value]) => {
          studentForm.append(key, value);
        });

        const { data } = await axios.post(`${backendUrl}/api/roles/students`, studentForm, {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        });

        if (data.success) {
          toast.success("Student data saved successfully!");
          setStudentUID(data.student_uid);
          setStep(3);
        } else toast.error(data.message);
      } catch (error) {
        toast.error(error.response?.data?.message || error.message);
      }
      return;
    }

    setStep((prev) => prev + 1);
  };

  const handleBack = () => setStep((prev) => prev - 1);

  //  Final Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!studentUID) {
      toast.error("Student UID missing! Complete step 2 first.");
      return;
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/roles/students/moreData/${studentUID}`,
        formData,
        { withCredentials: true }
      );

      if (data.success) {
        toast.success("All data saved successfully!");
        setFormData({});
        setStep(1);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300">
      <NavInsideBar />

      <div className="flex flex-col items-center pt-6 px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2 text-center">
          {sectionTitles[step - 1]}
        </h2>
        <p className="text-slate-500 mb-6 text-center">Step {step} of 5</p>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-2xl rounded-xl p-6 sm:p-10 w-full max-w-3xl mb-10"
        >
          {/* STEP 1 - Batch Details */}
          {step === 1 && (
            <div className="grid grid-cols-1 gap-6">
              <Select
                label="Course"
                name="course"
                value={formData.course || ""}
                onChange={handleChange}
                options={courses}
                required
              />
              <Select
                label="Year"
                name="year"
                options={["2025-2029", "2026-2030", "2027-2031", "2028-2032"]}
                value={formData.year || ""}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {/* TODO: Keep your existing Step 2-5 code here (unchanged) */}
          {/* Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={handleBack}
                className="px-6 py-2 bg-gray-300 text-slate-800 rounded-lg font-semibold hover:bg-gray-400"
              >
                Back
              </button>
            )}
            {step < 5 && (
              <button
                type="button"
                onClick={handleNext}
                className="ml-auto px-6 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
              >
                Next
              </button>
            )}
            {step === 5 && (
              <button
                type="submit"
                className="ml-auto px-6 py-2 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-600 cursor-pointer"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContentData;
