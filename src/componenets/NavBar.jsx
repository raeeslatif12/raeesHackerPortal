import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa"; // npm i react-icons

export default function NavBar({ showBack = false }) {
  const navigate = useNavigate();

  return (
    <nav className="w-full bg-[#00120a] border-b border-green-800/50 p-4 flex items-center justify-between shadow-md">
      <div className="flex items-center gap-4">
        {showBack && (
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-3 py-1 rounded-lg border border-green-500 text-green-200 hover:bg-green-900/30 hover:shadow-[0_0_10px_#00ff66] transition-all"
          >
            <FaArrowLeft className="text-green-300" />
            <span className="text-sm font-semibold">Back</span>
          </button>
        )}
        <div className="cursor-pointer" onClick={() => navigate("/")}>
          <h1 className="text-xl md:text-2xl font-bold text-green-300 tracking-tight hover:text-green-400 transition-colors">
            RAEES' HACKPORTAL
          </h1>
          <p className="text-xs md:text-sm text-green-200/80 mt-1 hover:text-green-300 transition-colors">
            Neon hacking-style project hub — click a card to open the project.
          </p>
        </div>
      </div>
    </nav>
  );
}
