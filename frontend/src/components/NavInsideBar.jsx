import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const NavInsideBar = () => {
  const navigate = useNavigate();
  const { backendUrl } = useContext(AppContent);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [years, setYears] = useState([]);

  const dropdownRef = useRef(null);

  const navItems = [
    { label: "Add", path: "/content" },
    { label: "View", path: "/view" },
    { label: "Print", path: "/print" },
    { label: "Total", dropdown: true },
    { label: "Profile", path: "/profile" },
  ];

  //  Fetch all distinct years dynamically from backend
  useEffect(() => {
    const fetchYears = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/roles/get-courses-years`, {
          withCredentials: true,
        });
        if (data.success) {
          setYears(data.years || []);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.error("Error fetching years:", error.message);
        toast.error("Failed to fetch years.");
      }
    };
    fetchYears();
  }, [backendUrl]);

  //  Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-slate-900 px-6 py-3 flex items-center justify-between shadow-md relative">
      {/* Logo */}
      <div
        onClick={() => navigate("/")}
        className="text-white text-2xl font-bold tracking-wide cursor-pointer"
      >
        Students Mgmt.
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-6">
        {navItems.map((item) =>
          item.dropdown ? (
            <div key={item.label} className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="text-slate-200 hover:text-white hover:bg-slate-700 px-4 py-2 rounded transition-colors duration-200 font-medium flex items-center"
              >
                {item.label}
                <span className="ml-1">{isDropdownOpen ? "▲" : "▼"}</span>
              </button>

              {/* Dropdown */}
              {isDropdownOpen && (
                <div className="absolute mt-2 w-44 bg-white rounded-lg shadow-lg z-20 border border-slate-200 animate-fade-in">
                  {years.length > 0 ? (
                    years.map((year) => (
                      <button
                        key={year}
                        onClick={() => {
                          navigate(`/total/${year}`);
                          setIsDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-100 transition"
                      >
                        {year}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-slate-500 italic text-sm">
                      No years available
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <button
              key={item.label}
              className="text-slate-200 hover:text-white hover:bg-slate-700 px-4 py-2 rounded transition-colors duration-200 font-medium"
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </button>
          )
        )}
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white focus:outline-none"
        >
          {isMobileMenuOpen ? "✖" : "☰"}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-slate-800 flex flex-col items-start md:hidden shadow-lg z-30">
          {navItems.map((item) =>
            item.dropdown ? (
              <div key={item.label} className="w-full" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full text-left text-slate-200 hover:text-white hover:bg-slate-700 px-4 py-2 transition font-medium flex items-center"
                >
                  {item.label}
                  <span className="ml-1">{isDropdownOpen ? "▲" : "▼"}</span>
                </button>
                {isDropdownOpen && (
                  <div className="w-full bg-slate-700">
                    {years.length > 0 ? (
                      years.map((year) => (
                        <button
                          key={year}
                          onClick={() => {
                            navigate(`/total/${year}`);
                            setIsDropdownOpen(false);
                            setIsMobileMenuOpen(false);
                          }}
                          className="block w-full text-left px-6 py-2 text-slate-200 hover:bg-slate-600 transition"
                        >
                          {year}
                        </button>
                      ))
                    ) : (
                      <div className="px-6 py-2 text-slate-400 italic text-sm">
                        No years available
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <button
                key={item.label}
                className="w-full text-left text-slate-200 hover:text-white hover:bg-slate-700 px-4 py-2 transition font-medium"
                onClick={() => {
                  navigate(item.path);
                  setIsMobileMenuOpen(false);
                }}
              >
                {item.label}
              </button>
            )
          )}
        </div>
      )}
    </nav>
  );
};

export default NavInsideBar;
