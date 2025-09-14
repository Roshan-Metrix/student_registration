import React, { useContext, useState } from "react";
import NavInsideBar from "../components/NavInsideBar";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ContentData = () => {
  axios.defaults.withCredentials = true;
  const [isHostelResident, setIsHostelResident] = React.useState(false);

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
      <div className="flex flex-col items-center pt-6">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Student Info</h2>
        <p className="text-slate-500 mb-6">Fill in the details below</p>
        <form
          className="bg-white shadow-2xl rounded-xl p-10 w-full max-w-3xl mb-10"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Name
              </label>
              <input
                className="input input-bordered w-full"
                name="name"
                placeholder="Name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Date of Birth
              </label>
              <input
                className="input input-bordered w-full"
                name="dob"
                type="date"
                placeholder="Date of Birth"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Father's Name
              </label>
              <input
                className="input input-bordered w-full"
                name="fatherName"
                placeholder="Father's Name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Father's Occupation
              </label>
              <input
                className="input input-bordered w-full"
                name="fatherOccupation"
                placeholder="Father's Occupation"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mother's Name
              </label>
              <input
                className="input input-bordered w-full"
                name="motherName"
                placeholder="Mother's Name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mother's Occupation
              </label>
              <input
                className="input input-bordered w-full"
                name="motherOccupation"
                placeholder="Mother's Occupation"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Medium of Instruction (12th Std)
              </label>
              <input
                className="input input-bordered w-full"
                name="mediumOfInstruction"
                placeholder="Medium of Instruction"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Marks Scored
              </label>
              <input
                className="input input-bordered w-full"
                name="marksScored"
                type="number"
                placeholder="Marks Scored"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Percentage
              </label>
              <input
                className="input input-bordered w-full"
                name="percentage"
                type="number"
                step="0.01"
                placeholder="Percentage"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                School Name & Place
              </label>
              <input
                className="input input-bordered w-full"
                name="schoolNamePlace"
                placeholder="School Name & Place"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Religion
              </label>
              <input
                className="input input-bordered w-full"
                name="religion"
                placeholder="Religion"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nationality
              </label>
              <input
                className="input input-bordered w-full"
                name="nationality"
                placeholder="Nationality"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Category
              </label>
              <select
                className="input input-bordered w-full"
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
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Date of Admission
              </label>
              <input
                className="input input-bordered w-full"
                name="dateOfAdmission"
                type="date"
                placeholder="Date of Admission"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Date of Leaving
              </label>
              <input
                className="input input-bordered w-full"
                name="dateOfLeaving"
                type="date"
                placeholder="Date of Leaving"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Aadhaar No.
              </label>
              <input
                className="input input-bordered w-full"
                name="aadhaar"
                type="text"
                placeholder="Aadhaar No."
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Contact No
              </label>
              <input
                className="input input-bordered w-full"
                name="contactNo"
                type="tel"
                placeholder="Contact No"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                className="input input-bordered w-full"
                name="email"
                type="email"
                placeholder="Email"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Address
              </label>
              <input
                className="input input-bordered w-full"
                name="address"
                placeholder="Address"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Gender
              </label>
              <select
                className="input input-bordered w-full"
                name="gender"
                required
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Upload Photo
              </label>
              <input
                className="input input-bordered w-full"
                name="photo"
                type="file"
                accept="image/*"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Courses
              </label>
              <select
                className="input input-bordered w-full"
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
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Blood Group
              </label>
              <select
                className="input input-bordered w-full"
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
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Scholarship Details
              </label>
              <input
                className="input input-bordered w-full"
                name="scholarshipDetails"
                placeholder="Scholarship Details"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Year
              </label>
              <input
                className="input input-bordered w-full"
                name="year"
                type="number"
                placeholder="1-4"
                min="1"
                max="4"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Hostel Resident?
              </label>
              <select
                className="input input-bordered w-full"
                name="hosteller"
                onChange={handleHostelResidentChange}
                required
              >
                <option value="">Select</option>
                <option value="Yes">Yes</option>
                <option value="No">No</option>
              </select>
            </div>
            {isHostelResident && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Hostel Resident Detail
                </label>
                <input
                  className="input input-bordered w-full"
                  name="hostellerDetail"
                  placeholder="Hostel Resident Detail"
                  required
                />
              </div>
            )}
          </div>
          <button
            type="submit"
            className="mt-8 w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-800 transition"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default ContentData;
