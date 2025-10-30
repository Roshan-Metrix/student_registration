import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";

const NavBar = () => {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedin } =
    useContext(AppContent);

  const [showDropdown, setShowDropdown] = useState(false);

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(backendUrl + "/api/auth/logout");

      if (data.success) {
        setIsLoggedin(false);
        setUserData(null);
        toast.success("Logged out successfully");
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-slate-900 w-full flex justify-between items-center px-4 sm:px-6 py-2 sm:py-3 fixed top-0 shadow-md z-50">
      {/* Logo */}
      <div
        className="flex items-center cursor-pointer"
        onClick={() => navigate("/")}
      >
        <p className="text-white font-semibold text-xl sm:text-2xl">
          Students Mgmt.
        </p>
      </div>

      {/* Right Side */}
      {userData ? (
        <div
          className="relative"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          {/* Avatar */}
          <div className="w-10 h-10 sm:w-11 sm:h-11 flex justify-center items-center rounded-full bg-white text-slate-900 font-bold cursor-pointer">
            {userData.name[0].toUpperCase()}
          </div>

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 top-full w-40 bg-white rounded-lg shadow-lg border border-slate-200 animate-fadeIn">
              <ul className="list-none m-0 p-2 text-sm text-slate-700">
                <li
                  onClick={() => {
                    navigate("/profile");
                    setShowDropdown(false);
                  }}
                  className="py-2 px-3 hover:bg-slate-100 rounded-md cursor-pointer font-medium"
                >
                  👤 Profile
                </li>
                <li
                  onClick={logout}
                  className="py-2 px-3 hover:bg-red-100 text-red-600 rounded-md cursor-pointer font-medium"
                >
                  🚪 Logout
                </li>
              </ul>
            </div>
          )}
        </div>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="flex items-center gap-2 border border-gray-400 rounded-full px-4 sm:px-6 py-1.5 sm:py-2 bg-white text-slate-900 hover:bg-gray-100 transition-all cursor-pointer text-sm sm:text-base"
        >
          Login <img src={assets.arrow_icon} alt="" className="w-4 sm:w-5" />
        </button>
      )}
    </div>
  );
};

export default NavBar;
