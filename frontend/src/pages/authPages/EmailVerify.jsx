import React, { useContext, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../../context/AppContext";

const EmailVerify = () => {
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();
  const inputRefs = React.useRef([]);
  const { backendUrl, isLoggedin, userData, getUserData } =
    useContext(AppContent);

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      const otpArray = inputRefs.current.map((e) => e.value);
      const otp = otpArray.join("");

      const { data } = await axios.post(
        backendUrl + "/api/auth/verify-account",
        { otp }
      );
      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

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

  useEffect(() => {
    isLoggedin && userData && userData.isAccountVerified && navigate("/");
  }, [isLoggedin, userData, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300">
      {/* Top Navbar */}
      <div className="absolute top-0 left-0 right-0 bg-slate-900 py-4 px-6 flex items-center justify-between shadow-lg">
        <div
          onClick={() => navigate("/")}
          className="text-white font-semibold text-2xl sm:text-3xl cursor-pointer"
        >
          P.K Arts College
        </div>
      </div>

      {/* Card */}
      <div className="max-w-md w-full rounded-2xl shadow-2xl p-8 text-center bg-white mt-20">
        <h2 className="text-3xl font-bold mb-3 text-slate-900">
          Email Verification
        </h2>
        <p className="text-slate-600 mb-7">
          Enter the <span className="font-semibold">6-digit OTP</span> sent to
          your email
        </p>

        <form onSubmit={onSubmitHandler} className="flex flex-col items-center">
          {/* OTP Inputs */}
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

          {/* Verify Button */}
          <button
            type="submit"
            className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white text-lg font-semibold py-3 rounded-lg w-full shadow-md hover:from-indigo-500 hover:to-indigo-700 transition cursor-pointer"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailVerify;
