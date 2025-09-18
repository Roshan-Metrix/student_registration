import React, { useEffect, useState, useContext } from "react";
import NavInsideBar from "../components/NavInsideBar";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {

  const { backendUrl , setIsLoggedin } = useContext(AppContent);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/user/data`, {
          withCredentials: true,
        });
        if (data.success) {
          setUser(data.userData);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Error fetching user: " + error.message);
      }
    };
    fetchUser();
  }, [backendUrl]);

  // Handle logout
  const handleLogout = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`, {}, { withCredentials: true });
      if (data.success) {
        setIsLoggedin(false)
        toast.success("Logged out successfully");
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error logging out: " + error.message);
    }
  };

  // Handle delete account
  const handleDelete = async () => {
    if (!window.confirm("⚠️ Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }
    try {
      const { data } = await axios.delete(`${backendUrl}/api/auth/user/delete`, { withCredentials: true });
      if (data.success) {
        toast.success("Account deleted successfully");
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Error deleting account: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-300">
      <NavInsideBar />

      <div className="flex flex-col items-center pt-5">
        <h2 className="text-3xl font-bold text-slate-800 mb-6">Admin Profile</h2>

        {user ? (
          <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-lg">
            <div className="mb-6">
              <p className="text-sm text-slate-500">Name</p>
              <p className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-1">
                {user.name}
              </p>
            </div>
            <div className="mb-6">
              <p className="text-sm text-slate-500">Email</p>
              <p className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-1">
                {user.email}
              </p>
            </div>
            <div className="mb-6">
              <p className="text-sm text-slate-500">Role</p>
              <p className="text-lg font-semibold text-slate-800 border-b border-slate-200 pb-1">
                {user.role}
              </p>
            </div>

            {/* Buttons */}
            <div className="flex flex-col gap-3 mt-6">
              <button
                onClick={handleLogout}
                className="bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-500 transition cursor-pointer"
              >
                Logout
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white py-2 rounded-lg font-medium hover:bg-red-500 transition cursor-pointer"
              >
                Delete Account
              </button>
              <button
                onClick={handlePasswordChange}
                className="text-blue-600 pl-[70%] py-1 rounded-lg font-small hover:bg-blue-500 transition cursor-pointer"
              >
                Change Password
              </button>
            </div>
          </div>
        ) : (
          <p className="text-slate-600 text-lg">Loading user data...</p>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
