// import React, { useContext, useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import NavInsideBar from "../components/NavInsideBar";
// import { AppContent } from "../context/AppContext";
// import axios from "axios";
// import { toast } from "react-toastify";

// const UpdateStudentData = () => {
//   const { student_uid } = useParams();
//   const { backendUrl } = useContext(AppContent);
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({});
//   const [extraData, setExtraData] = useState({});
//   const [newPhoto, setNewPhoto] = useState(null);

//   axios.defaults.withCredentials = true;

//   // Fetch both student & extra data
//   useEffect(() => {
//     const fetchAll = async () => {
//       try {
//         const [mainRes, moreRes] = await Promise.all([
//           axios.get(`${backendUrl}/api/roles/viewStudentData/${student_uid}`, {
//             withCredentials: true,
//           }),
//           axios.get(`${backendUrl}/api/datas/user/more/${student_uid}`, {
//             withCredentials: true,
//           }),
//         ]);

//         if (mainRes.data.success) setFormData(mainRes.data.student);
//         if (moreRes.data.success) setExtraData(moreRes.data.moreData || {});
//       } catch (err) {
//         toast.error(err.message);
//       }
//     };
//     fetchAll();
//   }, [student_uid, backendUrl]);

//   // Handle changes for both sets
//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     // Decide where the value belongs
//     if (
//       name.startsWith("fees") ||
//       name.startsWith("attendance") ||
//       name.startsWith("examfees") ||
//       name.startsWith("gpa") ||
//       name.startsWith("cgpa") ||
//       name.startsWith("marksheet")
//     ) {
//       setExtraData((prev) => ({ ...prev, [name]: value }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       // ---- 1. Update main student data ----
//       const updatedForm = new FormData();
//       Object.entries(formData).forEach(([key, value]) => {
//         if (key !== "photo" && value !== undefined && value !== null) {
//           updatedForm.append(key, value);
//         }
//       });
//       if (newPhoto) updatedForm.append("photo", newPhoto);

//       const mainRes = await axios.put(
//         `${backendUrl}/api/roles/updateStudentData/${student_uid}`,
//         updatedForm,
//         {
//           headers: { "Content-Type": "multipart/form-data" },
//           withCredentials: true,
//         }
//       );

//       // ---- 2. Update extra details ----
//       const extraRes = await axios.put(
//         `${backendUrl}/api/datas/user/more/${student_uid}`,
//         extraData,
//         { withCredentials: true }
//       );

//       if (mainRes.data.success && extraRes.data.success) {
//         toast.success("All student details updated successfully!");
//         navigate("/view");
//       } else {
//         toast.error("Failed to update some details.");
//       }
//     } catch (err) {
//       toast.error(err.response?.data?.message || err.message);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300">
//       <NavInsideBar />
//       <div className="flex flex-col items-center pt-10 px-4">
//         <h2 className="text-3xl font-bold text-slate-800 mb-6 text-center">
//           Edit Complete Student Details
//         </h2>

//         <form
//           onSubmit={handleSubmit}
//           className="bg-white shadow-2xl rounded-xl p-8 sm:p-10 w-full max-w-5xl mb-10"
//           encType="multipart/form-data"
//         >
//           {/* 🏫 BATCH DETAILS */}
//           <h3 className="text-xl font-semibold mb-4 border-b pb-1">
//             Batch Details
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <select
//               name="course"
//               value={formData.course || ""}
//               onChange={handleChange}
//               className="border rounded-lg px-3 py-2"
//             >
//               <option value="">Select Course</option>
//               <option>B.A (Tamil)</option>
//               <option>B.Sc (Mathematics)</option>
//               <option>B.B.A (Tourism)</option>
//               <option>B.C.A (Computer Applications)</option>
//               <option>B.Com</option>
//             </select>

//             <select
//               name="year"
//               value={formData.year || ""}
//               onChange={handleChange}
//               className="border rounded-lg px-3 py-2"
//             >
//               <option value="">Select Year</option>
//               <option value="1">1st Year</option>
//               <option value="2">2nd Year</option>
//               <option value="3">3rd Year</option>
//               <option value="4">4th Year</option>
//             </select>
//           </div>

//           {/* 🧍 PERSONAL INFORMATION */}
//           <h3 className="text-xl font-semibold mt-8 mb-4 border-b pb-1">
//             Personal Information
//           </h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <input
//               name="name"
//               value={formData.name || ""}
//               onChange={handleChange}
//               placeholder="Name"
//               className="border rounded-lg px-3 py-2"
//               required
//             />
//             <input
//               type="date"
//               name="dob"
//               value={formData.dob ? formData.dob.split("T")[0] : ""}
//               onChange={handleChange}
//               className="border rounded-lg px-3 py-2"
//               required
//             />
//             <input
//               name="fatherName"
//               value={formData.fatherName || ""}
//               onChange={handleChange}
//               placeholder="Father's Name"
//               className="border rounded-lg px-3 py-2"
//               required
//             />
//             <input
//               name="fatherOccupation"
//               value={formData.fatherOccupation || ""}
//               onChange={handleChange}
//               placeholder="Father's Occupation"
//               className="border rounded-lg px-3 py-2"
//               required
//             />
//             <input
//               name="motherName"
//               value={formData.motherName || ""}
//               onChange={handleChange}
//               placeholder="Mother's Name"
//               className="border rounded-lg px-3 py-2"
//             />
//             <input
//               name="motherOccupation"
//               value={formData.motherOccupation || ""}
//               onChange={handleChange}
//               placeholder="Mother's Occupation"
//               className="border rounded-lg px-3 py-2"
//             />
//             <input
//               name="contactNo"
//               value={formData.contactNo || ""}
//               onChange={handleChange}
//               placeholder="Contact Number"
//               className="border rounded-lg px-3 py-2"
//             />
//             <input
//               name="email"
//               type="email"
//               value={formData.email || ""}
//               onChange={handleChange}
//               placeholder="Email"
//               className="border rounded-lg px-3 py-2"
//             />
//             <input
//               name="aadhaar"
//               value={formData.aadhaar || ""}
//               onChange={handleChange}
//               placeholder="Aadhaar Number"
//               className="border rounded-lg px-3 py-2"
//             />
//             <input
//               name="address"
//               value={formData.address || ""}
//               onChange={handleChange}
//               placeholder="Address"
//               className="border rounded-lg px-3 py-2"
//             />
//             <select
//               name="gender"
//               value={formData.gender || ""}
//               onChange={handleChange}
//               className="border rounded-lg px-3 py-2"
//             >
//               <option value="">Select Gender</option>
//               <option>Male</option>
//               <option>Female</option>
//             </select>
//             <select
//               name="category"
//               value={formData.category || ""}
//               onChange={handleChange}
//               className="border rounded-lg px-3 py-2"
//             >
//               <option value="">Select Category</option>
//               <option>FC</option>
//               <option>BC</option>
//               <option>OBC</option>
//               <option>MBC</option>
//               <option>BCM</option>
//               <option>EBC</option>
//               <option>SC</option>
//             </select>
//             <input
//               name="religion"
//               value={formData.religion || ""}
//               onChange={handleChange}
//               placeholder="Religion"
//               className="border rounded-lg px-3 py-2"
//             />
//             <input
//               name="nationality"
//               value={formData.nationality || ""}
//               onChange={handleChange}
//               placeholder="Nationality"
//               className="border rounded-lg px-3 py-2"
//             />
//             <input
//               type="date"
//               name="dateOfAdmission"
//               value={
//                 formData.dateOfAdmission
//                   ? formData.dateOfAdmission.split("T")[0]
//                   : ""
//               }
//               onChange={handleChange}
//               className="border rounded-lg px-3 py-2"
//             />
//             <input
//               type="date"
//               name="dateOfLeaving"
//               value={
//                 formData.dateOfLeaving
//                   ? formData.dateOfLeaving.split("T")[0]
//                   : ""
//               }
//               onChange={handleChange}
//               className="border rounded-lg px-3 py-2"
//             />
//             <input
//               name="schoolNamePlace"
//               value={formData.schoolNamePlace || ""}
//               onChange={handleChange}
//               placeholder="School Name & Place"
//               className="border rounded-lg px-3 py-2"
//             />
//             <input
//               name="mediumOfInstruction"
//               value={formData.mediumOfInstruction || ""}
//               onChange={handleChange}
//               placeholder="Medium of Instruction"
//               className="border rounded-lg px-3 py-2"
//             />
//             <input
//               type="number"
//               name="marksScored"
//               value={formData.marksScored || ""}
//               onChange={handleChange}
//               placeholder="Marks Scored"
//               className="border rounded-lg px-3 py-2"
//             />
//             <input
//               type="number"
//               step="0.01"
//               name="percentage"
//               value={formData.percentage || ""}
//               onChange={handleChange}
//               placeholder="Percentage"
//               className="border rounded-lg px-3 py-2"
//             />
//           </div>

//           {/* 🩸 Photo */}
//           {formData.photo && (
//             <div className="mt-6">
//               <p className="text-sm text-slate-600 mb-2">Current Photo:</p>
//               <img
//                 src={`${backendUrl}/api/upload/${formData.photo}?t=${Date.now()}`}
//                 alt="student"
//                 className="w-32 h-32 object-cover rounded-lg border"
//               />
//             </div>
//           )}
//           <div className="mt-3">
//             <label className="block text-sm font-medium mb-1">
//               Upload New Photo
//             </label>
//             <input
//               type="file"
//               accept="image/*"
//               onChange={(e) => setNewPhoto(e.target.files[0])}
//             />
//           </div>

//           {/* 💰 FEES DETAILS */}
//           <h3 className="text-xl font-semibold mt-8 mb-3 border-b pb-1">
//             Fees Details
//           </h3>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//             {[1, 2, 3, 4].map((yr) => (
//               <input
//                 key={yr}
//                 name={`feesYear${yr}`}
//                 type="number"
//                 placeholder={`Year ${yr}`}
//                 value={extraData[`feesYear${yr}`] || ""}
//                 onChange={handleChange}
//                 className="border rounded-lg px-3 py-2"
//               />
//             ))}
//           </div>

//           {/* 📅 ATTENDANCE */}
//           <h3 className="text-xl font-semibold mt-8 mb-3 border-b pb-1">
//             Attendance Percentage
//           </h3>
//           <div className="grid grid-cols-2 md:grid-cols-8 gap-4">
//             {[...Array(8)].map((_, i) => (
//               <input
//                 key={i}
//                 name={`attendanceSem${i + 1}`}
//                 type="number"
//                 placeholder={`Sem ${i + 1}`}
//                 value={extraData[`attendanceSem${i + 1}`] || ""}
//                 onChange={handleChange}
//                 className="border rounded-lg px-3 py-2"
//               />
//             ))}
//           </div>

//           {/* 📘 SEMESTER DETAILS */}
//           <h3 className="text-xl font-semibold mt-8 mb-3 border-b pb-1">
//             Semester Details
//           </h3>
//           <div className="overflow-x-auto">
//             <table className="w-full border border-slate-300 rounded-lg text-sm">
//               <thead className="bg-slate-200">
//                 <tr>
//                   <th className="px-3 py-2 border-r">Description</th>
//                   {[...Array(8)].map((_, i) => (
//                     <th key={i} className="px-3 py-2 border-r">
//                       Sem {i + 1}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {["Exam Fees", "GPA", "CGPA", "MarkSheet"].map((desc) => (
//                   <tr key={desc}>
//                     <td className="px-3 py-2 border-r font-medium">{desc}</td>
//                     {[...Array(8)].map((_, sem) => (
//                       <td key={sem} className="px-3 py-2 border-r">
//                         <input
//                           name={`${desc.replace(/\s/g, "").toLowerCase()}Sem${
//                             sem + 1
//                           }`}
//                           type={
//                             desc === "Exam Fees" ? "number" : "text"
//                           } // ✅ Fix numeric input
//                           value={
//                             extraData[
//                               `${desc.replace(/\s/g, "").toLowerCase()}Sem${
//                                 sem + 1
//                               }`
//                             ] || ""
//                           }
//                           onChange={handleChange}
//                           className="border rounded px-2 py-1 w-full"
//                         />
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <button
//             type="submit"
//             className="mt-8 w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-700 transition cursor-pointer"
//           >
//             Update All Details
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default UpdateStudentData;


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
  const [extraData, setExtraData] = useState({});
  const [newPhoto, setNewPhoto] = useState(null);

  axios.defaults.withCredentials = true;

  // Fetch student info (includes fees, attendance, semester)
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/roles/viewStudentData/${student_uid}`,
          { withCredentials: true }
        );

        if (data.success) {
          setFormData(data.student || {});
          setExtraData({
            ...(data.student_fees?.[0] || {}),
            ...(data.student_attendance?.[0] || {}),
            ...(data.student_semesters?.[0] || {}),
          });
        } else toast.error(data.message);
      } catch (err) {
        toast.error(err.message);
      }
    };
    fetchAll();
  }, [student_uid, backendUrl]);

  // Input handler
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (
      name.startsWith("fees") ||
      name.startsWith("attendance") ||
      name.startsWith("examfees") ||
      name.startsWith("gpa") ||
      name.startsWith("cgpa") ||
      name.startsWith("marksheet")
    ) {
      setExtraData((prev) => ({ ...prev, [name]: value }));
    } else {
      // Capitalize name automatically
      if (name === "name") {
        const cap = value.toUpperCase();
        setFormData((prev) => ({ ...prev, [name]: cap }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    }
  };

  // Submit handler
const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    // --- Update main student info ---
    const updatedForm = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "photo" && value !== undefined && value !== null)
        updatedForm.append(key, value);
    });
    if (newPhoto) updatedForm.append("photo", newPhoto);

    const mainRes = await axios.put(
      `${backendUrl}/api/roles/updateStudentData/${student_uid}`,
      updatedForm,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }
    );

    // --- Update extra data ---
    const extraRes = await axios.put(
      `${backendUrl}/api/roles/updateExtraStudentData/${student_uid}`,
      extraData,
      { withCredentials: true }
    );

    if (mainRes.data.success || extraRes.data.success) {
      toast.success("Details updated successfully!");
      navigate("/view");
    } else {
      toast.warn("No changes detected or failed to update.");
    }
  } catch (err) {
    toast.error(err.response?.data?.message || err.message);
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300">
      <NavInsideBar />
      <div className="flex flex-col items-center pt-10 px-4">
        <h2 className="text-3xl font-bold text-slate-800 mb-6 text-center">
          Edit Complete Student Details
        </h2>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-2xl rounded-xl p-8 sm:p-10 w-full max-w-5xl mb-10"
          encType="multipart/form-data"
        >
          {/* 🏫 Batch Details */}
          <h3 className="text-xl font-semibold mb-4 border-b pb-1">
            Batch Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <select
              name="course"
              value={formData.course || ""}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2"
            >
              <option value="">Select Course</option>
              <option>B.A (Tamil)</option>
              <option>B.Sc (Mathematics)</option>
              <option>B.B.A (Tourism)</option>
              <option>B.C.A (Computer Applications)</option>
              <option>B.Com</option>
            </select>

            <select
              name="year"
              value={formData.year || ""}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2"
            >
              <option value="">Select Year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>

          {/* 👤 Personal Information */}
          <h3 className="text-xl font-semibold mt-8 mb-4 border-b pb-1">
            Personal Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              placeholder="Full Name"
              className="border rounded-lg px-3 py-2"
              required
            />
            <input
              type="date"
              name="dob"
              value={formData.dob ? formData.dob.split("T")[0] : ""}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2"
              required
            />
            <input
              name="fatherName"
              value={formData.fatherName || ""}
              onChange={handleChange}
              placeholder="Father's Name"
              className="border rounded-lg px-3 py-2"
              required
            />
            <input
              name="fatherOccupation"
              value={formData.fatherOccupation || ""}
              onChange={handleChange}
              placeholder="Father's Occupation"
              className="border rounded-lg px-3 py-2"
              required
            />
            <input
              name="motherName"
              value={formData.motherName || ""}
              onChange={handleChange}
              placeholder="Mother's Name"
              className="border rounded-lg px-3 py-2"
            />
            <input
              name="motherOccupation"
              value={formData.motherOccupation || ""}
              onChange={handleChange}
              placeholder="Mother's Occupation"
              className="border rounded-lg px-3 py-2"
            />
            <input
              name="contactNo"
              value={formData.contactNo || ""}
              onChange={handleChange}
              placeholder="Contact Number"
              className="border rounded-lg px-3 py-2"
            />
            <input
              type="email"
              name="email"
              value={formData.email || ""}
              onChange={handleChange}
              placeholder="Email"
              className="border rounded-lg px-3 py-2"
            />
            <input
              name="aadhaar"
              value={formData.aadhaar || ""}
              onChange={handleChange}
              placeholder="Aadhaar Number"
              className="border rounded-lg px-3 py-2"
            />
            <input
              name="address"
              value={formData.address || ""}
              onChange={handleChange}
              placeholder="Address"
              className="border rounded-lg px-3 py-2"
            />
            <select
              name="gender"
              value={formData.gender || ""}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2"
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
            </select>
            <select
              name="category"
              value={formData.category || ""}
              onChange={handleChange}
              className="border rounded-lg px-3 py-2"
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

          {/* 🩸 Photo Upload */}
          {formData.photo && (
            <div className="mt-6">
              <p className="text-sm text-slate-600 mb-2">Current Photo:</p>
              <img
                src={`${backendUrl}/api/upload/${formData.photo}`}
                alt="student"
                className="w-32 h-32 object-cover rounded-lg border"
              />
            </div>
          )}
          <div className="mt-3">
            <label className="block text-sm font-medium mb-1">
              Upload New Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setNewPhoto(e.target.files[0])}
            />
          </div>

          {/* 💰 Fees Details */}
          <h3 className="text-xl font-semibold mt-8 mb-3 border-b pb-1">
            Fees Details
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((yr) => (
              <input
                key={yr}
                name={`feesYear${yr}`}
                type="number"
                placeholder={`Year ${yr}`}
                value={extraData[`feesYear${yr}`] || ""}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2"
              />
            ))}
          </div>

          {/* 📅 Attendance */}
          <h3 className="text-xl font-semibold mt-8 mb-3 border-b pb-1">
            Attendance Percentage
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-8 gap-4">
            {[...Array(8)].map((_, i) => (
              <input
                key={i}
                name={`attendanceSem${i + 1}`}
                type="number"
                placeholder={`Sem ${i + 1}`}
                value={extraData[`attendanceSem${i + 1}`] || ""}
                onChange={handleChange}
                className="border rounded-lg px-3 py-2"
              />
            ))}
          </div>

          {/* 📘 Semester Details */}
          <h3 className="text-xl font-semibold mt-8 mb-3 border-b pb-1">
            Semester Details
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full border border-slate-300 rounded-lg text-sm">
              <thead className="bg-slate-200">
                <tr>
                  <th className="px-3 py-2 border-r">Description</th>
                  {[...Array(8)].map((_, i) => (
                    <th key={i} className="px-3 py-2 border-r">
                      Sem {i + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {["Exam Fees", "GPA", "CGPA", "MarkSheet"].map((desc) => (
                  <tr key={desc}>
                    <td className="px-3 py-2 border-r font-medium">{desc}</td>
                    {[...Array(8)].map((_, sem) => (
                      <td key={sem} className="px-3 py-2 border-r">
                        <input
                          name={`${desc.replace(/\s/g, "").toLowerCase()}Sem${
                            sem + 1
                          }`}
                          type={desc === "Exam Fees" ? "number" : "text"}
                          value={
                            extraData[
                              `${desc.replace(/\s/g, "").toLowerCase()}Sem${
                                sem + 1
                              }`
                            ] || ""
                          }
                          onChange={handleChange}
                          className="border rounded px-2 py-1 w-full"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ✅ Submit */}
          <button
            type="submit"
            className="mt-8 w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-slate-700 transition cursor-pointer"
          >
            Update All Details
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateStudentData;
