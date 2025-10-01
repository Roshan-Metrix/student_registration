import React, { useState, useContext } from "react";
import NavInsideBar from "../components/NavInsideBar";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  required,
  step,
  min,
  max,
}) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">
      {label}
    </label>
    <input
      className={`w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none ${
        name === "name" ? "capitalize" : "" 
      }`}
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

// --- Reusable Select Component (Included for completeness) ---
const Select = ({ label, name, value, onChange, options, required = false }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">
      {label}
    </label>
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
// ------------------------------------------------------------------


const ContentData = () => {
  const { backendUrl } = useContext(AppContent);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    fatherName: "",
    fatherOccupation: "",
    motherName: "",
    motherOccupation: "",
    mediumOfInstruction: "",
    marksScored: "",
    percentage: "",
    schoolNamePlace: "",
    religion: "",
    nationality: "",
    category: "",
    dateOfAdmission: "",
    dateOfLeaving: "",
    aadhaar: "",
    contactNo: "",
    email: "",
    address: "",
    gender: "",
    course: "",
    year: "",
    bloodGroup: "",
    scholarshipDetails: "",
    hosteller: "",
    hostellerDetail: "",
    photo: null,
  });

  const sectionTitles = [
    "Batch Details",
    "Student Informations",
    "Fee's Details",
    "Attendance Percentage",
    "Semester Table",
    "Other Information",
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    let finalValue = value;

    if (name === 'name') {
        finalValue = value.split(' ')
            .map(word => word.toUpperCase())
            .join(' ');
    }

    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : finalValue,
    }));
  };

  

  const handleNext = () => {
    // Validate required fields 
    if(step === 1 && (!formData.course || !formData.year)){
     toast.error("Course and Year are compulsory!");
      return;
      }
    if (
      step === 2 &&
      (!formData.name ||
        !formData.dob ||
        !formData.fatherName ||
        !formData.fatherOccupation)
    ) {
      toast.error("Please fill all mandatory fields!");
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const finalData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        finalData.append(key, value);
      });

      const { data } = await axios.post(
        backendUrl + "/api/roles/students",
        finalData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      if (data.success) {
        toast.success(data.message);
        setFormData(Object.fromEntries(Object.keys(formData).map(key => [key, key === 'photo' ? null : ''])));
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

         {/* Step 1 - Batch Details */}
          {step === 1 && (
            <div className="grid grid-cols-1 gap-6">
               <Select
                label="Course"
                name="course"
                value={formData.course}
                onChange={handleChange}
                options={[
                  "B.A (Tamil)",
                  "B.Sc (Mathematics)",
                  "B.B.A (Tourism)",
                  "B.C.A (Computer Applications)",
                  "B.Com",
                ]}
                required
              />
              <Select
                label="Year"
                name="year"
                type="number"
                options={[
                  "1",
                  "2",
                  "3",
                  "4",
                ]}
                value={formData.year}
                onChange={handleChange}
              />
            </div>
          )}

          {/* Step 1 - Student Information */}
          {step === 2 && (
            <div className="grid grid-cols-1 gap-6">
              <Input
                label="Name *"
                name="name" 
                value={formData.name}
                onChange={handleChange}
                required
              />
              <Input
                label="Date of Birth *"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={handleChange}
                required
              />
              <Input
                label="Father's Name *"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                required
              />
              <Input
                label="Father's Occupation *"
                name="fatherOccupation"
                value={formData.fatherOccupation}
                onChange={handleChange}
                required
              />
              <Input
                label="Mother's Name"
                name="motherName"
                value={formData.motherName}
                onChange={handleChange}
              />
              <Input
                label="Mother's Occupation"
                name="motherOccupation"
                value={formData.motherOccupation}
                onChange={handleChange}
              />
               <Input
                label="Medium of Instruction"
                name="mediumOfInstruction"
                value={formData.mediumOfInstruction}
                onChange={handleChange}
              />
              <Input
                label="Marks Scored"
                name="marksScored"
                type="number"
                value={formData.marksScored}
                onChange={handleChange}
              />
              <Input
                label="Percentage"
                name="percentage"
                type="number"
                step="0.01"
                value={formData.percentage}
                onChange={handleChange}
              />
              <Input
                label="School Name & Place"
                name="schoolNamePlace"
                value={formData.schoolNamePlace}
                onChange={handleChange}
              />
              <Input
                label="Religion"
                name="religion"
                value={formData.religion}
                onChange={handleChange}
              />
              <Input
                label="Nationality"
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
              />
               <Input
                label="Date of Admission"
                name="dateOfAdmission"
                type="date"
                value={formData.dateOfAdmission}
                onChange={handleChange}
              />
              <Input
                label="Date of Leaving"
                name="dateOfLeaving"
                type="date"
                value={formData.dateOfLeaving}
                onChange={handleChange}
              />
              <Input
                label="Aadhaar"
                name="aadhaar"
                value={formData.aadhaar}
                onChange={handleChange}
              />
              <Input
                label="Contact No"
                name="contactNo"
                value={formData.contactNo}
                onChange={handleChange}
              />
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
              <Input
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
              <Select
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                options={["Male", "Female"]}
              />
              <Select
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required={true}
                options={["FC", "BC", "OBC", "MBC", "BCM", "EBC", "SC"]}
              />
               <Select
                label="Blood Group"
                name="bloodGroup"
                value={formData.bloodGroup}
                onChange={handleChange}
                options={["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"]}
              />
              <Input
                label="Scholarship Details"
                name="scholarshipDetails"
                value={formData.scholarshipDetails}
                onChange={handleChange}
              />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Upload Photo
                </label>
                <input
                  type="file"
                  name="photo"
                  accept="image/*"
                  onChange={handleChange}
                />
              </div>
            </div>
          )}

          {/* Step 2 - Fee's Details */}
          {step === 3 && (
            <div className="grid grid-cols-1 gap-6">
              <table className="w-full border border-slate-300 rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-slate-200">
                    <th colSpan={4} className="text-left px-4 py-2 font-semibold">Academic Year Fees</th>
                  </tr>
                  <tr>
                    <th className="px-4 py-2 border-r">I</th>
                    <th className="px-4 py-2 border-r">II</th>
                    <th className="px-4 py-2 border-r">III</th>
                    <th className="px-4 py-2">IV</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="px-4 py-2 border-r">
                      <Input
                        name="feesYear1"
                        type="number"
                        value={formData.feesYear1 || ""}
                        onChange={handleChange}
                        placeholder="Enter fees"
                      />
                    </td>
                    <td className="px-4 py-2 border-r">
                      <Input
                        name="feesYear2"
                        type="number"
                        value={formData.feesYear2 || ""}
                        onChange={handleChange}
                        placeholder="Enter fees"
                      />
                    </td>
                    <td className="px-4 py-2 border-r">
                      <Input
                        name="feesYear3"
                        type="number"
                        value={formData.feesYear3 || ""}
                        onChange={handleChange}
                        placeholder="Enter fees"
                      />
                    </td>
                    <td className="px-4 py-2">
                      <Input
                        name="feesYear4"
                        type="number"
                        value={formData.feesYear4 || ""}
                        onChange={handleChange}
                        placeholder="Enter fees"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Step 3 - Percentage Of Attendance in each semester */}
          {step === 4 && (
            <div className="grid grid-cols-1 gap-6">
            <table className="w-full border border-slate-300 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-slate-200">
                  <th colSpan={8} className="text-left px-4 py-2 font-semibold">Attendance Percentage (Semester-wise)</th>
                </tr>
                <tr>
                  <th className="px-4 py-2 border-r">I</th>
                  <th className="px-4 py-2 border-r">II</th>
                  <th className="px-4 py-2 border-r">III</th>
                  <th className="px-4 py-2 border-r">IV</th>
                  <th className="px-4 py-2 border-r">V</th>
                  <th className="px-4 py-2 border-r">VI</th>
                  <th className="px-4 py-2 border-r">VII</th>
                  <th className="px-4 py-2">VIII</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-4 py-2 border-r">
                    <Input
                      name="attendanceSem1"
                      type="number"
                      value={formData.attendanceSem1 || ""}
                      onChange={handleChange}
                      placeholder="Enter %"
                      min={0}
                      max={100}
                    />
                  </td>
                  <td className="px-4 py-2 border-r">
                    <Input
                      name="attendanceSem2"
                      type="number"
                      value={formData.attendanceSem2 || ""}
                      onChange={handleChange}
                      placeholder="Enter %"
                      min={0}
                      max={100}
                    />
                  </td>
                  <td className="px-4 py-2 border-r">
                    <Input
                      name="attendanceSem3"
                      type="number"
                      value={formData.attendanceSem3 || ""}
                      onChange={handleChange}
                      placeholder="Enter %"
                      min={0}
                      max={100}
                    />
                  </td>
                  <td className="px-4 py-2 border-r">
                    <Input
                      name="attendanceSem4"
                      type="number"
                      value={formData.attendanceSem4 || ""}
                      onChange={handleChange}
                      placeholder="Enter %"
                      min={0}
                      max={100}
                    />
                  </td>
                  <td className="px-4 py-2 border-r">
                    <Input
                      name="attendanceSem5"
                      type="number"
                      value={formData.attendanceSem5 || ""}
                      onChange={handleChange}
                      placeholder="Enter %"
                      min={0}
                      max={100}
                    />
                  </td>
                  <td className="px-4 py-2 border-r">
                    <Input
                      name="attendanceSem6"
                      type="number"
                      value={formData.attendanceSem6 || ""}
                      onChange={handleChange}
                      placeholder="Enter %"
                      min={0}
                      max={100}
                    />
                  </td>
                  <td className="px-4 py-2 border-r">
                    <Input
                      name="attendanceSem7"
                      type="number"
                      value={formData.attendanceSem7 || ""}
                      onChange={handleChange}
                      placeholder="Enter %"
                      min={0}
                      max={100}
                    />
                  </td>
                  <td className="px-4 py-2">
                    <Input
                      name="attendanceSem8"
                      type="number"
                      value={formData.attendanceSem8 || ""}
                      onChange={handleChange}
                      placeholder="Enter %"
                      min={0}
                      max={100}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            </div>
          )}

          {/* Step 4 - Semester Table */}
          {step === 5 && (
            <div className="grid grid-cols-1 gap-6">
            <table className="w-full border border-slate-300 rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-slate-200">
                  <th className="px-4 py-2 border-r">Description</th>
                  <th colSpan={8} className="px-4 py-2">Semester</th>
                </tr>
                <tr>
                  <th className="px-4 py-2 border-r"></th>
                  {[...Array(8)].map((_, i) => (
                    <th key={i} className="px-4 py-2 border-r">{`Sem ${i + 1}`}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {["Exam Fees", "GPA", "CGPA", "MarkSheet"].map((desc, rowIdx) => (
                  <tr key={desc}>
                    <td className="px-4 py-2 border-r font-semibold">{desc}</td>
                    {[...Array(8)].map((_, semIdx) => (
                      <td key={semIdx} className="px-4 py-2 border-r">
                        <Input
                          name={`${desc.replace(/\s/g, '').toLowerCase()}Sem${semIdx + 1}`}
                          type={desc === "Exam Fees" ? "number" : "text"}
                          value={formData[`${desc.replace(/\s/g, '').toLowerCase()}Sem${semIdx + 1}`] || ""}
                          onChange={handleChange}
                          placeholder={desc === "Exam Fees" ? "Fees" : desc}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          )}

          {/* Step 5 - Course & Address */}
          {/* {step === 6 && (
            <div className="grid grid-cols-1 gap-6">
              
            </div>
          )} */}

          {/* Navigation buttons */}
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
                className="ml-auto px-6 py-2 bg-green-700 text-white rounded-lg font-semibold hover:bg-green-600"
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