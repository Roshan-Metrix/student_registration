import React, { useEffect, useState, useContext } from "react";
import NavInsideBar from "../components/NavInsideBar";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  Loader2,
  UserPlus,
  Users,
  UserCircle2,
  LogOut,
  Trash2,
  Lock,
  ChevronDown,
} from "lucide-react";

const UserProfile = () => {
  const { backendUrl, setIsLoggedin } = useContext(AppContent);
  const [user, setUser] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    dept: "",
    email: "",
    password: "",
  });
  const [resetData, setResetData] = useState({
    email: "",
    oldPassword: "",
    newPassword: "",
  });
  const [activeTab, setActiveTab] = useState("profile");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [subTab, setSubTab] = useState("addUser");
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/roles/user/data`);
        if (data.success) {
          setUser(data.userData);
          if (data.userData.role === "admin") fetchAllUsers();
        } else toast.error(data.message);
      } catch (error) {
        toast.error("Error fetching user: " + error.message);
      }
    };
    fetchUser();
  }, [backendUrl]);

  // Fetch all users
  const fetchAllUsers = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/auth/all-users`);
      if (data.success) setUsersList(data.users);
      else toast.error(data.message);
    } catch (error) {
      toast.error("Error fetching users: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Add new user
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/api/auth/register`,
        newUser
      );
      if (data.success) {
        toast.success("User added successfully");
        setNewUser({ name: "", dept: "", email: "", password: "" });
        fetchAllUsers();
      } else toast.error(data.message);
    } catch (error) {
      toast.error("Error adding user: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Delete user (by admin)
  const handleDeleteUser = async (id) => {
    if (!window.confirm("⚠️ Are you sure you want to delete this user?"))
      return;
    try {
      setLoading(true);
      const { data } = await axios.delete(
        `${backendUrl}/api/auth/user/admin/delete/${id}`
      );
      if (data.success) {
        toast.success("User deleted successfully");
        fetchAllUsers();
      } else toast.error(data.message);
    } catch (error) {
      toast.error("Error deleting user: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Reset Staff Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${backendUrl}/api/auth/reset-password`,
        resetData
      );
      if (data.success) {
        toast.success("Password reset successfully");
        setResetData({ email: "", oldPassword: "", newPassword: "" });
      } else toast.error(data.message);
    } catch (error) {
      toast.error("Error resetting password: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const handleLogout = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/auth/logout`);
      if (data.success) {
        setIsLoggedin(false);
        toast.success("Logged out successfully");
        navigate("/");
      } else toast.error(data.message);
    } catch (error) {
      toast.error("Error logging out: " + error.message);
    }
  };

  // Delete own account
  const handleDelete = async () => {
    if (!window.confirm("⚠️ Are you sure? This action cannot be undone."))
      return;
    try {
      const { data } = await axios.delete(`${backendUrl}/api/auth/user/delete`);
      if (data.success) {
        toast.success("Account deleted successfully");
        navigate("/");
      } else toast.error(data.message);
    } catch (error) {
      toast.error("Error deleting account: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 flex flex-col">
      <NavInsideBar />

      <div className="flex flex-col lg:flex-row mt-20 px-4 sm:px-6 md:px-10 pb-10 gap-6">
        {/* Sidebar */}
        <div className="bg-white rounded-2xl shadow-lg p-4 flex lg:flex-col gap-3 justify-between lg:justify-start lg:w-60 w-full lg:h-[75vh]">
          {/* Profile Button */}
          <button
            onClick={() => {
              setActiveTab("profile");
              setDropdownOpen(false);
            }}
            className={`flex items-center gap-2 py-2 px-4 rounded-lg w-full text-left font-medium transition ${
              activeTab === "profile"
                ? "bg-indigo-600 text-white"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            <UserCircle2 className="w-5 h-5" /> Profile
          </button>

          {/* Edit Info Add Button */}
           {user?.role === "admin" && (
          <button
            onClick={() => {
              setActiveTab("editInfo");
              setDropdownOpen(false);
            }}
            className={`flex items-center gap-2 py-2 px-4 rounded-lg w-full text-left font-medium transition ${
              activeTab === "editInfo"
                ? "bg-indigo-600 text-white"
                : "text-slate-700 hover:bg-slate-100"
            }`}
          >
            📝 Edit Info Add
          </button>
           )}

          {/* Manage Users (Dropdown for Admins) */}
          {user?.role === "admin" && (
            <div className="w-full">
              <button
                onClick={() => {
                  if (!dropdownOpen) {
                    setActiveTab("users");
                    setDropdownOpen(true);
                    setSubTab("addUser"); // Default open Add User
                  } else {
                    setDropdownOpen(false);
                  }
                }}
                className={`flex items-center justify-between gap-2 py-2 px-4 rounded-lg w-full text-left font-medium transition ${
                  activeTab === "users"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span className="flex items-center gap-2">
                  <Users className="w-5 h-5" /> Manage Users
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown Options */}
              {dropdownOpen && (
                <div className="ml-6 mt-2 flex flex-col gap-1">
                  <button
                    onClick={() => setSubTab("addUser")}
                    className={`text-left py-1 px-3 rounded-md text-sm ${
                      subTab === "addUser"
                        ? "bg-indigo-100 text-indigo-700 font-medium"
                        : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    ➕ Add New User
                  </button>
                  <button
                    onClick={() => setSubTab("resetPassword")}
                    className={`text-left py-1 px-3 rounded-md text-sm ${
                      subTab === "resetPassword"
                        ? "bg-indigo-100 text-indigo-700 font-medium"
                        : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    🔐 Reset Staff Password
                  </button>
                  <button
                    onClick={() => setSubTab("allUsers")}
                    className={`text-left py-1 px-3 rounded-md text-sm ${
                      subTab === "allUsers"
                        ? "bg-indigo-100 text-indigo-700 font-medium"
                        : "hover:bg-slate-100 text-slate-700"
                    }`}
                  >
                    👥 All Users
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white shadow-xl rounded-2xl p-6">
          {/* Profile Section */}
          {activeTab === "profile" && (
            <div>
              <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                👤 Profile Details
              </h2>

              {user ? (
                <>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between border-b pb-2">
                      <span className="text-slate-500">Name</span>
                      <span className="font-semibold text-slate-800">
                        {user.name}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between border-b pb-2">
                      <span className="text-slate-500">Email</span>
                      <span className="font-semibold text-slate-800">
                        {user.email}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row justify-between border-b pb-2">
                      <span className="text-slate-500">Role</span>
                      <span className="font-semibold text-slate-800 capitalize">
                        {user.role}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-8">
                    <button
                      onClick={handleLogout}
                      className="flex-1 bg-indigo-600 text-white py-2.5 rounded-lg font-medium hover:bg-indigo-500 transition flex items-center justify-center gap-2"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex-1 bg-red-600 text-white py-2.5 rounded-lg font-medium hover:bg-red-500 transition flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                </div>
              )}
            </div>
          )}

          {/* Empty Page for Edit Info Add */}
          {activeTab === "editInfo" && (
            <div className="flex justify-center items-center h-80 text-slate-500 italic">
              ✏️ Edit Info Add page coming soon...
            </div>
          )}

          {/* Manage Users Sections */}
          {activeTab === "users" && dropdownOpen && (
            <>
              {/* Add User */}
              {subTab === "addUser" && (
                <form
                  onSubmit={handleAddUser}
                  className="bg-slate-50 p-4 rounded-xl shadow-sm mb-8 space-y-3"
                >
                  <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                    <UserPlus className="w-5 h-5" /> Add New User
                  </h3>
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    className="w-full border p-2 rounded-md"
                    required
                  />
                  <select
                    className="w-full border p-2 rounded-md"
                    value={newUser.dept}
                    onChange={(e) =>
                      setNewUser({ ...newUser, dept: e.target.value })
                    }
                    required
                  >
                    <option value="" disabled>
                      Department
                    </option>
                    <option value="B.A (Tamil)">B.A (Tamil)</option>
                    <option value="B.Sc (Mathematics)">
                      B.Sc (Mathematics)
                    </option>
                    <option value="B.B.A (Tourism)">B.B.A (Tourism)</option>
                    <option value="B.C.A (Computer Applications)">
                      B.C.A (Computer Applications)
                    </option>
                    <option value="B.Com">B.Com</option>
                  </select>
                  <input
                    type="email"
                    placeholder="Email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    className="w-full border p-2 rounded-md"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={newUser.password}
                    onChange={(e) =>
                      setNewUser({ ...newUser, password: e.target.value })
                    }
                    className="w-full border p-2 rounded-md"
                    required
                  />
                  <button
                    className="bg-green-600 text-white py-2.5 px-4 rounded-lg hover:bg-green-500 transition flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Add User"
                    )}
                  </button>
                </form>
              )}

              {/* Reset Password */}
              {subTab === "resetPassword" && (
                <form
                  onSubmit={handleResetPassword}
                  className="bg-slate-50 p-4 rounded-xl shadow-sm mb-8 space-y-3"
                >
                  <h3 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                    <Lock className="w-5 h-5" /> Reset Staff Password
                  </h3>

                  <input
                    type="email"
                    placeholder="Staff Email"
                    value={resetData.email}
                    onChange={(e) =>
                      setResetData({ ...resetData, email: e.target.value })
                    }
                    className="w-full border p-2 rounded-md"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Old Password"
                    value={resetData.oldPassword}
                    onChange={(e) =>
                      setResetData({
                        ...resetData,
                        oldPassword: e.target.value,
                      })
                    }
                    className="w-full border p-2 rounded-md"
                    required
                  />
                  <input
                    type="password"
                    placeholder="New Password"
                    value={resetData.newPassword}
                    onChange={(e) =>
                      setResetData({
                        ...resetData,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full border p-2 rounded-md"
                    required
                  />
                  <button
                    className="bg-indigo-600 text-white py-2.5 px-4 rounded-lg hover:bg-indigo-500 transition flex items-center justify-center gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Reset Password"
                    )}
                  </button>
                </form>
              )}

              {/* All Users */}
              {subTab === "allUsers" && (
                <div className="bg-slate-50 p-4 rounded-xl shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center gap-2">
                    <Users className="w-5 h-5" /> All Users
                  </h3>
                  {loading ? (
                    <div className="flex justify-center items-center h-24">
                      <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                    </div>
                  ) : usersList.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="min-w-full border text-sm text-left text-slate-700">
                        <thead className="bg-slate-200">
                          <tr>
                            <th className="px-4 py-2 border">Name</th>
                            <th className="px-4 py-2 border">Email</th>
                            <th className="px-4 py-2 border">Department</th>
                            <th className="px-4 py-2 border">Role</th>
                            <th className="px-4 py-2 border text-center">
                              Delete
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {usersList.map((u) => (
                            <tr
                              key={u.id}
                              className="hover:bg-slate-100 transition"
                            >
                              <td className="px-4 py-2 border">{u.name}</td>
                              <td className="px-4 py-2 border">{u.email}</td>
                              <td className="px-4 py-2 border">{u.dept}</td>
                              <td className="px-4 py-2 border capitalize">
                                {u.role}
                              </td>
                              <td className="px-4 py-2 border text-center">
                                <button
                                  onClick={() => handleDeleteUser(u.id)}
                                  className="bg-red-500 hover:bg-red-600 text-white rounded-md px-3 py-1 text-xs flex items-center justify-center gap-1 mx-auto"
                                >
                                  <Trash2 className="w-4 h-4" /> Delete
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-slate-500 text-sm">No users found.</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
