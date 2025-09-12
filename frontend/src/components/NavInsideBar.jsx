import React from 'react'
import { useNavigate } from "react-router-dom";

const NavInsideBar = () => {
    const navigate = useNavigate();
    const navItems = [
        { label: "Add", path: "/content" },
        { label: "View", path: "/view" },
        { label: "Print", path: "/print" },
        { label: "Total", path: "/total" },
        { label: "Setting", path: "/setting" },
    ];

    return (
        <nav className="bg-slate-900 px-6 py-3 flex items-center justify-between shadow-md">
            <div onClick={() => navigate('/content')} className="text-white text-2xl font-bold tracking-wide cursor-pointer">
               P.K Arts College
            </div>
            <div className="flex space-x-6">
                {navItems.map((item) => (
                    <button
                        key={item.label}
                        className="text-slate-200 hover:text-white hover:bg-slate-700 px-4 py-2 rounded transition-colors duration-200 font-medium"
                        onClick={() => navigate(item.path)}
                    >
                        {item.label}
                    </button>
                ))}
            </div>
        </nav>
    );
}


export default NavInsideBar