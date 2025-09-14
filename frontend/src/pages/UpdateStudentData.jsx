import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import NavInsideBar from "../components/NavInsideBar";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const UpdateStudentData = () => {
  const { student_uid } = useParams();
  const { backendUrl } = useContext(AppContent);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({});
  const [isHostelResident, setIsHostelResident] = useState(false);

  axios.defaults.withCredentials = true;

  // Fetch student data when page loads
  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/roles/viewStudentData/${student_uid}`,
          { withCredentials: true }
        );

        if (data.success) {
          setFormData(data.student);
          setIsHostelResident(data.student.hosteller === "Yes");
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    fetchStudent();
  }, [student_uid, backendUrl]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Hostel resident change
  const handleHostelResidentChange = (e) => {
    const value = e.target.value;
    setIsHostelResident(value === "Yes");
    setFormData((prev) => ({ ...prev, hosteller: value }));
  };

  // Submit edited data
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedFormData = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        updatedFormData.append(key, value);
      }
    });

    // Only add new photo if selected
    if (e.target.photo.files[0]) {
      updatedFormData.set("photo", e.target.photo.files[0]);
    }

    try {
      const { data } = await axios.put(
        `${backendUrl}/api/roles/updateStudentData/${student_uid}`,
        updatedFormData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      data.success ? toast.success(data.message) : toast.error(data.message);
      if (data.success) navigate("/view");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300">
      <NavInsideBar />
      <div className="flex flex-col items-center pt-10">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">
          Edit Student Info
        </h2>
        <form
          className="bg-white shadow-2xl rounded-xl p-10 w-full max-w-3xl mb-10"
          onSubmit={handleSubmit}
          encType="multipart/form-data"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
            {/* Example fields */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Name
              </label>
              <input
                className="input input-bordered w-full"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                required
              />
            </div>
         {/* Date Of Birth */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Date of Birth
              </label>
              <input
                className="input input-bordered w-full"
                name="dob"
                type="date"
                value={formData.dob ? formData.dob.split("T")[0] : ""}
                onChange={handleChange}
                required
              />
            </div>
            {/* Father's Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Father's Name
              </label>
              <input
                className="input input-bordered w-full"
                name="fatherName"
                value={formData.fatherName || ""}
                onChange={handleChange}
                required
              />
            </div>
             {/* Father's Occupation */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Father's Occupation
              </label>
              <input
                className="input input-bordered w-full"
                name="fatherOccupation"
                value={formData.fatherOccupation || ""}
                onChange={handleChange}
                required
              />
            </div>
              {/* Mother's Name */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mother's Name
              </label>
              <input
                className="input input-bordered w-full"
                name="motherName"
                value={formData.motherName || ""}
                onChange={handleChange}
                required
              />
            </div>
             {/* Mother's Occupation */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mother's Occupation
              </label>
              <input
                className="input input-bordered w-full"
                name="motherOccupation"
                value={formData.motherOccupation || ""}
                onChange={handleChange}
                required
              />
            </div>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                className="input input-bordered w-full"
                name="email"
                type="email"
                value={formData.email || ""}
                onChange={handleChange}
                required
              />
            </div>
            {/* Medium Of Instruction (12th std) */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
               Medium of Instruction (12th Std)
              </label>
              <input
                className="input input-bordered w-full"
                name="mediumOfInstruction"
                value={formData.mediumOfInstruction || ""}
                onChange={handleChange}
                required
              />
            </div>
             {/* Marks Scored */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
               Marks Scored
              </label>
              <input
                className="input input-bordered w-full"
                name="marksScored"
                type="number"
                value={formData.marksScored || ""}
                onChange={handleChange}
                required
              />
            </div>
             {/* Percentage Scored */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
               Percentage
              </label>
              <input
                className="input input-bordered w-full"
                name="percentage"
                type="number"
                value={formData.percentage || ""}
                onChange={handleChange}
                required
              />
            </div>
             {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Gender
              </label>
              <select
                className="input input-bordered w-full"
                name="category"
                value={formData.gender || ""}
                onChange={handleChange}
                required
              >
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>
            </div>
            {/* School Name & Place */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
               School Name & Place
              </label>
              <input
                className="input input-bordered w-full"
                name="schoolNamePlace"
                value={formData.schoolNamePlace || ""}
                onChange={handleChange}
                required
              />
            </div>
            {/* Religion */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
               Religion
              </label>
              <input
                className="input input-bordered w-full"
                name="religion"
                value={formData.religion || ""}
                onChange={handleChange}
                required
              />
            </div>
            {/* Nationality */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
               Nationality
              </label>
              <input
                className="input input-bordered w-full"
                name="nationality"
                value={formData.nationality || ""}
                onChange={handleChange}
                required
              />
            </div>
             {/* Date Of Admission */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Date of Admission
              </label>
              <input
                className="input input-bordered w-full"
                name="dateOfAdmission"
                type="date"
                value={formData.dateOfAdmission ? formData.dateOfAdmission.split("T")[0] : ""}
                onChange={handleChange}
                required
              />
            </div>
             {/* Date Of Leaving */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Date of Leaving
              </label>
              <input
                className="input input-bordered w-full"
                name="dateOfLeaving"
                type="date"
                value={formData.dateOfLeaving ? formData.dateOfLeaving.split("T")[0] : ""}
                onChange={handleChange}
                required
              />
            </div>
             {/* Contact No. */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
               Contact No
              </label>
              <input
                className="input input-bordered w-full"
                name="contactNo"
                type="tel"
                value={formData.contactNo || ""}
                onChange={handleChange}
                required
              />
            </div>
             {/* Aadhaar No. */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
               Aadhaar No
              </label>
              <input
                className="input input-bordered w-full"
                name="aadhaar"
                value={formData.aadhaar || ""}
                onChange={handleChange}
                required
              />
            </div>
            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
               Address
              </label>
              <input
                className="input input-bordered w-full"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
                required
              />
            </div>
             {/* Blood Group */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Blood Group
              </label>
              <select
                className="input input-bordered w-full"
                name="bloodGroup"
                value={formData.bloodGroup || ""}
                onChange={handleChange}
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
             {/* Year */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
               Year
              </label>
              <input
                className="input input-bordered w-full"
                name="year"
                type="number"
                min="1"
                max="4"
                value={formData.year || ""}
                onChange={handleChange}
                required
              />
              </div>
             {/* Course */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
               Course
              </label>
              <input
                className="input input-bordered w-full"
                name="course"
                value={formData.course || ""}
                onChange={handleChange}
                required
              /> 
            </div>
            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Category
              </label>
              <select
                className="input input-bordered w-full"
                name="category"
                value={formData.category || ""}
                onChange={handleChange}
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
            {/* Scholarship Details */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
               Scholarship Details
              </label>
              <input
                className="input input-bordered w-full"
                name="scholarshipDetails"
                value={formData.scholarshipDetails || ""}
                onChange={handleChange}
                required
              />
            </div>
            {/* Hostel */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Hostel Resident?
              </label>
              <select
                className="input input-bordered w-full"
                name="hosteller"
                value={formData.hosteller || ""}
                onChange={handleHostelResidentChange}
                required
              >
                <option value="">Select</option>
                <option>Yes</option>
                <option>No</option>
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
                  value={formData.hostellerDetail || ""}
                  onChange={handleChange}
                />
              </div>
            )}
            {/* Current photo preview (optional) */}
            {formData.photo && (
              <div className="col-span-2">
                <p className="text-sm text-slate-600 mb-2">Current Photo:</p>
                <img
                  src={`${backendUrl}/api/upload/${formData.photo}`}
                  alt="student"
                  className="w-32 h-32 object-cover rounded-lg border"
                />
              </div>
            )}
            {/* Upload new photo */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Upload New Photo
              </label>
              <input
                className="input input-bordered w-full"
                name="photo"
                type="file"
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-8 w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-700 transition cursor-pointer"
          >
            Update Student
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateStudentData;
