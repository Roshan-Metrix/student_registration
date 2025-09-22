import React, { useContext, useState } from "react";
import NavInsideBar from "../components/NavInsideBar";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ContentData = () => {
  axios.defaults.withCredentials = true;
  const [isHostelResident, setIsHostelResident] = useState(false);

  const { backendUrl } = useContext(AppContent);

  const handleHostelResidentChange = (e) => {
    setIsHostelResident(e.target.value === "Yes");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target); // includes text + file fields automatically

    try {
      const { data } = await axios.post(
        backendUrl + "/api/roles/students",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      data.success ? toast.success(data.message) : toast.error(data.message);

      e.target.reset();
      setIsHostelResident(false);
    } catch (error) {
      console.error("Error submitting student data:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300">
      <NavInsideBar />
      <div className="flex flex-col items-center pt-6 px-4 sm:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2 text-center">
          Student Info
        </h2>
        <p className="text-slate-500 mb-6 text-center">
          Fill in the details below
        </p>

        <form
          className="bg-white shadow-2xl rounded-xl p-6 sm:p-10 w-full max-w-4xl mb-10 overflow-y-auto"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {[
              { label: "Name", name: "name", type: "text", required: true },
              { label: "Date of Birth", name: "dob", type: "date", required: true },
              { label: "Father's Name", name: "fatherName", type: "text", required: true },
              {
                label: "Father's Occupation",
                name: "fatherOccupation",
                type: "text",
                required: true,
              },
              { label: "Mother's Name", name: "motherName", type: "text", required: true },
              {
                label: "Mother's Occupation",
                name: "motherOccupation",
                type: "text",
              },
              {
                label: "Medium of Instruction (12th Std)",
                name: "mediumOfInstruction",
                type: "text",
                required: true,
              },
              { label: "Marks Scored", name: "marksScored", type: "number" },
              {
                label: "Percentage",
                name: "percentage",
                type: "number",
                step: "0.01",
                min: "0",
                max: "100",
                required: true,
              },
              {
                label: "School Name & Place",
                name: "schoolNamePlace",
                type: "text",
                required: true,
              },
              { label: "Religion", name: "religion", type: "text", required: true },
              { label: "Nationality", name: "nationality", type: "text", required: true },
              {
                label: "Date of Admission",
                name: "dateOfAdmission",
                type: "date",
                required: true,
              },
              { label: "Date of Leaving", name: "dateOfLeaving", type: "date" },
              { label: "Aadhaar No.", name: "aadhaar", type: "text" },
              { label: "Contact No", name: "contactNo", type: "tel", max: "10", required: true },
              { label: "Email", name: "email", type: "email" },
              { label: "Address", name: "address", type: "text" },
              {
                label: "Year",
                name: "year",
                type: "number",
                min: "1",
                max: "4",
                required: true,
              },
            ].map(({ label, name, type, step, min, max }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  {label}
                </label>
                <input
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  name={name}
                  type={type}
                  step={step}
                  min={min}
                  max={max}
                  required
                />
              </div>
            ))}

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Category
              </label>
              <select
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                name="category"
                required
              >
                <option value="">Select Category</option>
                <option>FC</option>
                <option>BC</option>
                <option>OBC</option>
                <option>MBC</option>
                <option>BCM</option>
                <option>EBC</option>
                <option>SC</option>
              </select>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Gender
              </label>
              <select
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                name="gender"
                required
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>

            {/* Courses */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Courses
              </label>
              <select
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                name="course"
                required
              >
                <option value="">Select Course</option>
                <option>B.A (Tamil)</option>
                <option>B.Sc (Mathematics)</option>
                <option>B.B.A (Tourism)</option>
                <option>B.C.A (Computer Applications)</option>
                <option>B.Com</option>
              </select>
            </div>

            {/* Blood Group */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Blood Group
              </label>
              <select
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                name="bloodGroup"
                required
              >
                <option value="">Select Blood Group</option>
                <option>A+</option>
                <option>A-</option>
                <option>B+</option>
                <option>B-</option>
                <option>O+</option>
                <option>O-</option>
                <option>AB+</option>
                <option>AB-</option>
              </select>
            </div>

            {/* Scholarship */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Scholarship Details
              </label>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                name="scholarshipDetails"
                placeholder="Scholarship Details"
                required
              />
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Upload Photo
              </label>
              <input
                className="w-full rounded-lg border border-slate-300 px-3 py-2 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500"
                name="photo"
                type="file"
                accept="image/*"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-8 w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition cursor-pointer"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContentData;
