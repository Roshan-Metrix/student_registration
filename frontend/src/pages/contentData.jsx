import React, { useState, useContext } from "react";
import NavInsideBar from "../components/NavInsideBar";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

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
    "Personal Information",
    "Family Details",
    "School Details",
    "Admission & Contact",
    "Course & Address",
    "Other Information",
  ];

  // handle input changes
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleNext = () => {
    // Validate required fields on step 1
    if (
      step === 1 &&
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
        <p className="text-slate-500 mb-6 text-center">Step {step} of 6</p>

        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-2xl rounded-xl p-6 sm:p-10 w-full max-w-3xl mb-10"
        >
          {/* Step 1 - Personal Information */}
          {step === 1 && (
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
            </div>
          )}

          {/* Step 2 - Family Details */}
          {step === 2 && (
            <div className="grid grid-cols-1 gap-6">
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
            </div>
          )}

          {/* Step 3 - School Details */}
          {step === 3 && (
            <div className="grid grid-cols-1 gap-6">
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
            </div>
          )}

          {/* Step 4 - Admission & Contact */}
          {step === 4 && (
            <div className="grid grid-cols-1 gap-6">
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
            </div>
          )}

          {/* Step 5 - Course & Address */}
          {step === 5 && (
            <div className="grid grid-cols-1 gap-6">
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
              />
              <Input
                label="Year"
                name="year"
                type="number"
                min="1"
                max="4"
                value={formData.year}
                onChange={handleChange}
              />
            </div>
          )}

          {/* Step 6 - Other Information */}
          {step === 6 && (
            <div className="grid grid-cols-1 gap-6">
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
              <Select
                label="Hosteller"
                name="hosteller"
                value={formData.hosteller}
                onChange={handleChange}
                options={["Yes", "No"]}
              />
              {formData.hosteller === "Yes" && (
                <Input
                  label="Hosteller Detail"
                  name="hostellerDetail"
                  value={formData.hostellerDetail}
                  onChange={handleChange}
                />
              )}
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
            {step < 6 && (
              <button
                type="button"
                onClick={handleNext}
                className="ml-auto px-6 py-2 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800"
              >
                Next
              </button>
            )}
            {step === 6 && (
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

/* Reusable Input Component */
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

/* Reusable Select Component */
const Select = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-1">
      {label}
    </label>
    <select
      className="w-full rounded-lg border border-slate-300 px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
      name={name}
      value={value}
      onChange={onChange}
    >
      <option value="">Select</option>
      {options.map((opt, i) => (
        <option key={i} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

export default ContentData;
