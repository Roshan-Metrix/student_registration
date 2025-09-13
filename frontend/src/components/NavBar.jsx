// import React, { useContext, useState } from "react";
// import { assets } from "../assets/assets";
// import { useNavigate } from "react-router-dom";
// import { AppContent } from "../context/AppContext";
// import { toast } from "react-toastify";
// import axios from "axios";

// const NavBar = () => {
//   const navigate = useNavigate();
//   const { userData, backendUrl, setUserData, setIsLoggedin } =
//     useContext(AppContent);

//   const [showDropdown, setShowDropdown] = useState(false);

//   const logout = async () => {
//     if (!window.confirm("Are you sure you want to logout?")) return;

//     try {
//       axios.defaults.withCredentials = true;
//       const { data } = await axios.post(backendUrl + "/api/auth/logout");

//       if (data.success) {
//         setIsLoggedin(false);
//         setUserData(null);
//         toast.success("Logged out successfully");
//         navigate("/");
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error(error.message);
//     }
//   };

//   return (
//     <div className="bg-slate-900 w-full flex justify-between sm:py-3 sm:px-5 items-center fixed top-0 shadow-md z-50">
//       {/* Logo */}
//       <div
//         className="flex items-center cursor-pointer"
//         onClick={() => navigate("/")}
//       >
//         <p className="text-white font-semibold text-3xl sm:text-2xl mx-5">
//           P.K Arts College
//         </p>
//       </div>

//       {/* Right Side */}
//       {userData ? (
//         <div
//           className="w-11 h-11 mx-5 flex justify-center items-center rounded-full bg-white text-slate-900 font-bold cursor-pointer relative"
//           onClick={() => setShowDropdown(!showDropdown)}
//         >
//           {userData.name[0].toUpperCase()}
//           {/* Dropdown */}
//           {showDropdown && (
//             <div className="absolute right-0 mt-14 w-40 bg-white rounded-lg shadow-lg border border-slate-200 animate-fadeIn">
//               <ul className="list-none m-0 p-2 text-sm text-slate-700">
//                 <li
//                   onClick={() => {
//                     navigate("/setting");
//                     setShowDropdown(false);
//                   }}
//                   className="py-2 px-3 hover:bg-slate-100 rounded-md cursor-pointer font-medium"
//                 >
//                   ⚙️ Profile
//                 </li>
//                 <li
//                   onClick={logout}
//                   className="py-2 px-3 hover:bg-red-100 text-red-600 rounded-md cursor-pointer font-medium"
//                 >
//                   🚪 Logout
//                 </li>
//               </ul>
//             </div>
//           )}
//         </div>
//       ) : (
//         <button
//           onClick={() => navigate("/login")}
//           className="flex items-center gap-2 border border-gray-400 rounded-full px-6 py-2 text-slate-900 bg-white hover:bg-gray-100 transition-all cursor-pointer"
//         >
//           Login <img src={assets.arrow_icon} alt="" />
//         </button>
//       )}
//     </div>
//   );
// };

// export default NavBar;


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
    <div className="bg-slate-900 w-full flex justify-between sm:py-3 sm:px-5 items-center fixed top-0 shadow-md z-50">
      {/* Logo */}
      <div
        className="flex items-center cursor-pointer"
        onClick={() => navigate("/")}
      >
        <p className="text-white font-semibold text-3xl sm:text-2xl mx-5">
          P.K Arts College
        </p>
      </div>

      {/* Right Side */}
      {userData ? (
        <div
          className="w-11 h-11 mx-5 flex justify-center items-center rounded-full bg-white text-slate-900 font-bold cursor-pointer relative"
          onMouseEnter={() => setShowDropdown(true)}
          onMouseLeave={() => setShowDropdown(false)}
        >
          {userData.name[0].toUpperCase()}
          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute right-0 mt-30 w-40 bg-white rounded-lg shadow-lg border border-slate-200 animate-fadeIn">
              <ul className="list-none m-0 p-2 text-sm text-slate-700">
                <li
                  onClick={() => {
                    navigate("/profile");
                    setShowDropdown(false);
                  }}
                  className="py-2 px-3 hover:bg-slate-300 rounded-md cursor-pointer font-medium"
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
          className="flex items-center gap-2 border border-gray-400 rounded-full px-6 py-2 text-slate-900 bg-white hover:bg-gray-100 transition-all cursor-pointer"
        >
          Login <img src={assets.arrow_icon} alt="" />
        </button>
      )}
    </div>
  );
};

export default NavBar;

