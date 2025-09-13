import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const NavInsideBar = () => {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const navItems = [
    { label: "Add", path: "/content" },
    { label: "View", path: "/view" },
    { label: "Print", path: "/print" },
    { label: "Total", dropdown: true },
    { label: "Profile", path: "/profile" },
  ];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-slate-900 px-6 py-3 flex items-center justify-between shadow-md relative">
      {/* Logo */}
      <div
        onClick={() => navigate("/")}
        className="text-white text-2xl font-bold tracking-wide cursor-pointer"
      >
        P.K Arts College
      </div>

      {/* Menu */}
      <div className="flex space-x-6">
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
                  {["1stYear", "2ndYear", "3rdYear", "4thYear"].map((year) => (
                    <button
                      key={year}
                      onClick={() => {
                        navigate(`/total/${year}`);
                        setIsDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-100 transition"
                    >
                      {year.replace("Year", " Year")}
                    </button>
                  ))}
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
    </nav>
  );
};

export default NavInsideBar;

