// // import React, { useContext, useState } from "react";
// // import { assets } from "../assets/assets";
// // import { useNavigate } from "react-router-dom";
// // import { AppContent } from "../context/AppContext";
// // import axios from "axios";
// // import { toast } from "react-toastify";

// // const ResetPassword = () => {
// //   const { backendUrl } = useContext(AppContent);
// //   axios.defaults.withCredentials = true;

// //   const navigate = useNavigate();
// //   const [email, setEmail] = useState("");
// //   const [newPassword, setNewPassword] = useState("");
// //   const [isEmailSent, setIsEmailSent] = useState("");
// //   const [otp, setOtp] = useState(0);
// //   const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

// //   // handling input otp
// //   const inputRefs = React.useRef([]);

// //   const handleInput = (e, index) => {
// //     if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
// //       inputRefs.current[index + 1].focus();
// //     }
// //   };

// //   const handleKeyDown = (e, index) => {
// //     if (e.key === "Backspace" && e.target.value === "" && index > 0) {
// //       inputRefs.current[index - 1].focus();
// //     }
// //   };

// //   const handlePaste = (e) => {
// //     const paste = e.clipboardData.getData("text");
// //     const pasteArray = paste.split("");
// //     pasteArray.forEach((char, index) => {
// //       if (inputRefs.current[index]) {
// //         inputRefs.current[index].value = char;
// //       }
// //     });
// //   };

// //   const onSubmitEmail = async (e) => {
// //     e.preventDefault();
// //     try {
// //       const { data } = await axios.post(
// //         backendUrl + "/api/auth/send-reset-otp",
// //         { email }
// //       );
// //       data.success ? toast.success(data.message) : toast.error(data.message);
// //       data.success && setIsEmailSent(true);
// //     } catch (error) {
// //       toast.error(error.message);
// //     }
// //   };

// //   const onSubmitOTP = async (e) => {
// //     e.preventDefault();
// //     const otpArray = inputRefs.current.map((e) => e.value);
// //     setOtp(otpArray.join(""));
// //     setIsOtpSubmitted(true);
// //   };

// //   const onSubmitNewPassword = async (e) => {
// //     e.preventDefault();
// //     try {
// //       const { data } = await axios.post(
// //         backendUrl + "/api/auth/reset-password",
// //         { email, otp, newPassword }
// //       );
// //       data.success ? toast.success(data.message) : toast.error(data.message);
// //       data.success && navigate("/login");
// //     } catch (error) {
// //       toast.error(error.message);
// //     }
// //   };

// //   return (
// //     <div className="flex items-center justify-center min-h-screen bg-gray-100">
// //       <div className="bg-slate-900 w-full flex justify-between sm:py-3 sm:px-5 items-center absolute top-0">
// //         <div onClick={() => navigate("/")} className="flex items-center cursor-pointer">
// //           {/* <img src={assets.logo} alt="" className='w-25 sm:w-20' />*/}

// //           <p className="text-white font-semibold text-3xl sm:text-2xl mx-5">
// //             P.K Arts College
// //           </p>
// //         </div>
// //       </div>

// //       {/* Enter email id */}
// //       {!isEmailSent && (
// //         <div className="max-w-md w-full rounded-2xl shadow-lg p-8 text-center bg-slate-900">
// //           <h2 className="text-3xl font-bold mb-3 text-gray-200">
// //             Reset Password
// //           </h2>
// //           <p className="text-gray-400 mb-7">
// //             Enter the registered email address
// //           </p>

// //           <form onSubmit={onSubmitEmail} className="flex flex-col items-center">
// //             <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
// //               <img src={assets.mail_icon} alt="" className="w-4 h-4" />
// //               <input
// //                 type="email"
// //                 placeholder="Email id"
// //                 value={email}
// //                 onChange={(e) => setEmail(e.target.value)}
// //                 required
// //                 className="bg-transparent outline-none text-white"
// //               />
// //             </div>
// //             <button
// //               type="submit"
// //               className="bg-gradient-to-r from-blue-600 to-blue-400 text-white text-lg font-medium py-2.5 rounded-lg w-full shadow hover:from-blue-700 hover:to-blue-500 transition cursor-pointer"
// //             >
// //               Submit
// //             </button>
// //           </form>
// //         </div>
// //       )}

// //       {/* For adding otp */}
// //       {!isOtpSubmitted && isEmailSent && (
// //         <div className="max-w-md w-full rounded-2xl shadow-lg p-8 text-center bg-slate-900">
// //           <h2 className="text-3xl font-bold mb-3 text-gray-200">
// //             Reset Password OTP
// //           </h2>
// //           <p className="text-gray-400 mb-7">
// //             Enter the 6-digit OTP sent to your email
// //           </p>

// //           <form onSubmit={onSubmitOTP} className="flex flex-col items-center">
// //             <div
// //               className="flex gap-3 mb-6 justify-center"
// //               onPaste={handlePaste}
// //             >
// //               {Array(6)
// //                 .fill(0)
// //                 .map((_, index) => (
// //                   <input
// //                     type="text"
// //                     key={index}
// //                     maxLength={1}
// //                     pattern="[0-9]*"
// //                     required
// //                     ref={(e) => (inputRefs.current[index] = e)}
// //                     onInput={(e) => handleInput(e, index)}
// //                     onKeyDown={(e) => handleKeyDown(e, index)}
// //                     className="w-12 h-14 text-2xl text-center border-2 border-gray-300 rounded-lg outline-none bg-gray-100 focus:border-blue-500 focus:bg-white transition"
// //                   />
// //                 ))}
// //             </div>
// //             <button
// //               type="submit"
// //               className="bg-gradient-to-r from-blue-600 to-blue-400 text-white text-lg font-medium py-2.5 rounded-lg w-full shadow hover:from-blue-700 hover:to-blue-500 transition cursor-pointer"
// //             >
// //               Submit
// //             </button>
// //           </form>
// //         </div>
// //       )}

// //       {/* Enter new password */}
// //       {isOtpSubmitted && isEmailSent && (
// //         <div className="max-w-md w-full rounded-2xl shadow-lg p-8 text-center bg-slate-900">
// //           <h2 className="text-3xl font-bold mb-3 text-gray-200">
// //             New Password
// //           </h2>
// //           <p className="text-gray-400 mb-7">Enter the new password below</p>

// //           <form
// //             onSubmit={onSubmitNewPassword}
// //             className="flex flex-col items-center"
// //           >
// //             <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
// //               <img src={assets.lock_icon} alt="" className="w-4 h-4" />
// //               <input
// //                 type="password"
// //                 placeholder="Password"
// //                 value={newPassword}
// //                 onChange={(e) => setNewPassword(e.target.value)}
// //                 required
// //                 className="bg-transparent outline-none text-white"
// //               />
// //             </div>
// //             <button
// //               type="submit"
// //               className="bg-gradient-to-r from-blue-600 to-blue-400 text-white text-lg font-medium py-2.5 rounded-lg w-full shadow hover:from-blue-700 hover:to-blue-500 transition cursor-pointer"
// //             >
// //               Submit
// //             </button>
// //           </form>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // export default ResetPassword;

// import React, { useContext, useState } from "react";
// import { assets } from "../assets/assets";
// import { useNavigate } from "react-router-dom";
// import { AppContent } from "../context/AppContext";
// import axios from "axios";
// import { toast } from "react-toastify";

// const ResetPassword = () => {
//   const { backendUrl } = useContext(AppContent);
//   axios.defaults.withCredentials = true;

//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [isEmailSent, setIsEmailSent] = useState(false);
//   const [otp, setOtp] = useState(0);
//   const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

//   const inputRefs = React.useRef([]);

//   const handleInput = (e, index) => {
//     if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
//       inputRefs.current[index + 1].focus();
//     }
//   };

//   const handleKeyDown = (e, index) => {
//     if (e.key === "Backspace" && e.target.value === "" && index > 0) {
//       inputRefs.current[index - 1].focus();
//     }
//   };

//   const handlePaste = (e) => {
//     const paste = e.clipboardData.getData("text");
//     const pasteArray = paste.split("");
//     pasteArray.forEach((char, index) => {
//       if (inputRefs.current[index]) {
//         inputRefs.current[index].value = char;
//       }
//     });
//   };

//   const onSubmitEmail = async (e) => {
//     e.preventDefault();
//     try {
//       const { data } = await axios.post(
//         backendUrl + "/api/auth/send-reset-otp",
//         { email }
//       );
//       data.success ? toast.success(data.message) : toast.error(data.message);
//       if (data.success) setIsEmailSent(true);
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   const onSubmitOTP = async (e) => {
//     e.preventDefault();
//     const otpArray = inputRefs.current.map((e) => e.value);
//     setOtp(otpArray.join(""));
//     setIsOtpSubmitted(true);
//   };

//   const onSubmitNewPassword = async (e) => {
//     e.preventDefault();
//     try {
//       const { data } = await axios.post(
//         backendUrl + "/api/auth/reset-password",
//         { email, otp, newPassword }
//       );
//       data.success ? toast.success(data.message) : toast.error(data.message);
//       if (data.success) navigate("/login");
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300">
//       {/* Top Navbar */}
//       <div className="absolute top-0 left-0 right-0 bg-slate-900 py-4 px-6 flex items-center justify-between shadow-lg">
//         <div
//           onClick={() => navigate("/")}
//           className="text-white font-semibold text-2xl sm:text-3xl cursor-pointer"
//         >
//           P.K Arts College
//         </div>
//       </div>

//       {/* Step 1: Enter Email */}
//       {!isEmailSent && (
//         <div className="max-w-md w-full rounded-2xl shadow-2xl p-8 text-center bg-white mt-20">
//           <h2 className="text-3xl font-bold mb-3 text-slate-900">
//             Reset Password
//           </h2>
//           <p className="text-slate-600 mb-7">
//             Enter your registered <span className="font-medium">email</span> to
//             receive reset OTP
//           </p>

//           <form onSubmit={onSubmitEmail} className="flex flex-col items-center">
//             <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full border border-slate-300 bg-slate-50 focus-within:ring-2 focus-within:ring-indigo-500">
//               <img src={assets.mail_icon} alt="" className="w-5 h-5" />
//               <input
//                 type="email"
//                 placeholder="Email address"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 className="bg-transparent outline-none flex-1 text-slate-800 placeholder-slate-400"
//               />
//             </div>
//             <button
//               type="submit"
//               className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white text-lg font-semibold py-3 rounded-lg w-full shadow-md hover:from-indigo-500 hover:to-indigo-700 transition cursor-pointer"
//             >
//               Send OTP
//             </button>
//           </form>
//         </div>
//       )}

//       {/* Step 2: Enter OTP */}
//       {!isOtpSubmitted && isEmailSent && (
//         <div className="max-w-md w-full rounded-2xl shadow-2xl p-8 text-center bg-white mt-20">
//           <h2 className="text-3xl font-bold mb-3 text-slate-900">
//             Verify OTP
//           </h2>
//           <p className="text-slate-600 mb-7">
//             Enter the <span className="font-semibold">6-digit OTP</span> sent to
//             your email
//           </p>

//           <form onSubmit={onSubmitOTP} className="flex flex-col items-center">
//             <div
//               className="flex gap-3 mb-6 justify-center"
//               onPaste={handlePaste}
//             >
//               {Array(6)
//                 .fill(0)
//                 .map((_, index) => (
//                   <input
//                     type="text"
//                     key={index}
//                     maxLength={1}
//                     pattern="[0-9]*"
//                     required
//                     ref={(e) => (inputRefs.current[index] = e)}
//                     onInput={(e) => handleInput(e, index)}
//                     onKeyDown={(e) => handleKeyDown(e, index)}
//                     className="w-12 h-14 text-2xl font-semibold text-center border-2 border-slate-300 rounded-lg outline-none bg-slate-50 focus:border-indigo-600 focus:bg-white transition shadow-sm"
//                   />
//                 ))}
//             </div>
//             <button
//               type="submit"
//               className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white text-lg font-semibold py-3 rounded-lg w-full shadow-md hover:from-indigo-500 hover:to-indigo-700 transition cursor-pointer"
//             >
//               Verify OTP
//             </button>
//           </form>
//         </div>
//       )}

//       {/* Step 3: Enter New Password */}
//       {isOtpSubmitted && isEmailSent && (
//         <div className="max-w-md w-full rounded-2xl shadow-2xl p-8 text-center bg-white mt-20">
//           <h2 className="text-3xl font-bold mb-3 text-slate-900">
//             Set New Password
//           </h2>
//           <p className="text-slate-600 mb-7">
//             Enter your new password below to reset
//           </p>

//           <form
//             onSubmit={onSubmitNewPassword}
//             className="flex flex-col items-center"
//           >
//             <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full border border-slate-300 bg-slate-50 focus-within:ring-2 focus-within:ring-indigo-500">
//               <img src={assets.lock_icon} alt="" className="w-5 h-5" />
//               <input
//                 type="password"
//                 placeholder="New Password"
//                 value={newPassword}
//                 onChange={(e) => setNewPassword(e.target.value)}
//                 required
//                 className="bg-transparent outline-none flex-1 text-slate-800 placeholder-slate-400"
//               />
//             </div>
//             <button
//               type="submit"
//               className="bg-gradient-to-r from-green-600 to-green-800 text-white text-lg font-semibold py-3 rounded-lg w-full shadow-md hover:from-green-500 hover:to-green-700 transition cursor-pointer"
//             >
//               Reset Password
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ResetPassword;


import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { backendUrl } = useContext(AppContent);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const [loading, setLoading] = useState(false); // ⬅️ NEW

  const inputRefs = React.useRef([]);

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text");
    const pasteArray = paste.split("");
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char;
      }
    });
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(
        backendUrl + "/api/auth/send-reset-otp",
        { email }
      );
      data.success ? toast.success(data.message) : toast.error(data.message);
      if (data.success) setIsEmailSent(true);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onSubmitOTP = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((e) => e.value);
    setOtp(otpArray.join(""));
    setIsOtpSubmitted(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(
        backendUrl + "/api/auth/reset-password",
        { email, otp, newPassword }
      );
      data.success ? toast.success(data.message) : toast.error(data.message);
      if (data.success) navigate("/login");
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 relative">
      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center z-50">
          <div className="w-14 h-14 border-4 border-white border-t-indigo-500 rounded-full animate-spin"></div>
          <p className="mt-4 text-white font-medium">Processing...</p>
        </div>
      )}

      {/* Top Navbar */}
      <div className="absolute top-0 left-0 right-0 bg-slate-900 py-4 px-6 flex items-center justify-between shadow-lg">
        <div
          onClick={() => navigate("/")}
          className="text-white font-semibold text-2xl sm:text-3xl cursor-pointer"
        >
          P.K Arts College
        </div>
      </div>

      {/* Step 1: Enter Email */}
      {!isEmailSent && (
        <div className="max-w-md w-full rounded-2xl shadow-2xl p-8 text-center bg-white mt-20">
          <h2 className="text-3xl font-bold mb-3 text-slate-900">
            Reset Password
          </h2>
          <p className="text-slate-600 mb-7">
            Enter your registered <span className="font-medium">email</span> to
            receive reset OTP
          </p>

          <form onSubmit={onSubmitEmail} className="flex flex-col items-center">
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full border border-slate-300 bg-slate-50 focus-within:ring-2 focus-within:ring-indigo-500">
              <img src={assets.mail_icon} alt="" className="w-5 h-5" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-transparent outline-none flex-1 text-slate-800 placeholder-slate-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white text-lg font-semibold py-3 rounded-lg w-full shadow-md hover:from-indigo-500 hover:to-indigo-700 transition cursor-pointer disabled:opacity-50"
            >
              Send OTP
            </button>
          </form>
        </div>
      )}

      {/* Step 2: Enter OTP */}
      {!isOtpSubmitted && isEmailSent && (
        <div className="max-w-md w-full rounded-2xl shadow-2xl p-8 text-center bg-white mt-20">
          <h2 className="text-3xl font-bold mb-3 text-slate-900">Verify OTP</h2>
          <p className="text-slate-600 mb-7">
            Enter the <span className="font-semibold">6-digit OTP</span> sent to
            your email
          </p>

          <form onSubmit={onSubmitOTP} className="flex flex-col items-center">
            <div
              className="flex gap-3 mb-6 justify-center"
              onPaste={handlePaste}
            >
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <input
                    type="text"
                    key={index}
                    maxLength={1}
                    pattern="[0-9]*"
                    required
                    ref={(e) => (inputRefs.current[index] = e)}
                    onInput={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-12 h-14 text-2xl font-semibold text-center border-2 border-slate-300 rounded-lg outline-none bg-slate-50 focus:border-indigo-600 focus:bg-white transition shadow-sm"
                  />
                ))}
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white text-lg font-semibold py-3 rounded-lg w-full shadow-md hover:from-indigo-500 hover:to-indigo-700 transition cursor-pointer disabled:opacity-50"
            >
              Verify OTP
            </button>
          </form>
        </div>
      )}

      {/* Step 3: Enter New Password */}
      {isOtpSubmitted && isEmailSent && (
        <div className="max-w-md w-full rounded-2xl shadow-2xl p-8 text-center bg-white mt-20">
          <h2 className="text-3xl font-bold mb-3 text-slate-900">
            Set New Password
          </h2>
          <p className="text-slate-600 mb-7">
            Enter your new password below to reset
          </p>

          <form
            onSubmit={onSubmitNewPassword}
            className="flex flex-col items-center"
          >
            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full border border-slate-300 bg-slate-50 focus-within:ring-2 focus-within:ring-indigo-500">
              <img src={assets.lock_icon} alt="" className="w-5 h-5" />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="bg-transparent outline-none flex-1 text-slate-800 placeholder-slate-400"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-green-600 to-green-800 text-white text-lg font-semibold py-3 rounded-lg w-full shadow-md hover:from-green-500 hover:to-green-700 transition cursor-pointer disabled:opacity-50"
            >
              Reset Password
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ResetPassword;
