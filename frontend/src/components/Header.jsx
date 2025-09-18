import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";

const Header = () => {
  const navigate = useNavigate();
  const { userData } = useContext(AppContent);

  return (
    <div className="flex flex-col items-center mt-16 sm:mt-20 px-4 sm:px-6 text-center text-gray-800">
      {/* Profile Image */}
      <div className="bg-white w-44 sm:w-72 h-44 sm:h-72 rounded-full flex justify-center items-center mb-8 sm:mb-10 overflow-hidden shadow-2xl shadow-slate-900">
        <img
          src={assets.header_img}
          alt="Header"
          className="w-40 sm:w-60 h-40 sm:h-60 object-cover hover:-scale-x-100 transition duration-700 rounded-[80%]"
        />
      </div>

      {/* Greeting */}
      <h1 className="flex items-center justify-center gap-2 text-lg sm:text-3xl font-medium mb-2">
        Hey {userData ? userData.name : "User"}!
        <img className="w-6 sm:w-8 aspect-square" src={assets.hand_wave} alt="wave" />
      </h1>

      {/* Title */}
      <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
        Welcome To Student Management
      </h2>

      {/* Subtitle */}
      <p className="mb-8 max-w-md text-sm sm:text-base text-gray-600">
        Login and start managing your students effectively!
      </p>

      {/* CTA Button */}
      {userData && (
        <button
          onClick={() => navigate("/content")}
          className="border border-gray-500 rounded-full px-6 sm:px-8 py-2 sm:py-2.5 text-sm sm:text-base hover:bg-gray-100 transition-all cursor-pointer"
        >
          Get Started
        </button>
      )}
    </div>
  );
};

export default Header;
