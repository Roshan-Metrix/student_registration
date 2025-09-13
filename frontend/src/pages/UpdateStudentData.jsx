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
      <div className="flex flex-col items-center pt-12">
        <h2 className="text-3xl font-bold text-slate-800 mb-2">
          Edit Student Info
        </h2>
        <form
          className="bg-white shadow-2xl rounded-xl p-10 w-full max-w-3xl"
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
            className="mt-8 w-full bg-green-700 text-white py-3 rounded-lg font-semibold hover:bg-green-600 transition"
          >
            Update Student
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateStudentData;
