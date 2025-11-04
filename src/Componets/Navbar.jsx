import React, { useState } from "react";
import { Menu, Maximize } from "lucide-react"; // icons
import Person2Icon from "@mui/icons-material/Person2";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const handleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(
          `Error attempting to enable full-screen mode: ${err.message}`
        );
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login"; // redirect to login
  };

  return (
    <header
      className="w-full h-16 bg-white shadow flex items-center justify-between px-6 border-b border-gray-200
"
    >
      {/* Left Section - Logo + Brand */}
      <div className="flex items-center gap-4">
        <img
          src="\src\assets\Gemini Logo.svg" // replace with your logo path
          alt="Logo"
          className="h-80 w-50"
        />
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-4">
        {/* Fullscreen Icon */}
        <button
          onClick={handleFullScreen}
          className="p-2 rounded hover:bg-gray-100"
        >
          <Maximize className="h-5 w-5 text-gray-600" />
        </button>

        {/* Admin Profile */}
        <div className="relative">
          <div
            className="flex items-center bg-gray-600 text-white rounded-full px-3 py-1 gap-2 cursor-pointer"
            onClick={() => setOpen(!open)}
          >
            <span>
              Hello, <span className="font-semibold">admin</span>
            </span>
            <img
              src="https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png" // replace with profile/logo icon
              alt="Admin"
              className="h-8 w-8 rounded-full border-2 border-white"
            />
          </div>

          {/* Dropdown menu */}
          {open && (
            <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-md overflow-hidden z-50">
              {/* Profile button */}
              <button
                className="flex items-center gap-2 w-full px-4 py-2 text-gray-700 hover:bg-gray-100 transition-colors duration-200"
                onClick={() => navigate("/profile")} // replace with actual profile action
              >
                <Person2Icon className="text-blue-600" />
                <span>Profile</span>
              </button>

              {/* Logout button */}
              <button
                className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-red-50 transition-colors duration-200 font-semibold"
                onClick={handleLogout}
              >
                <LogoutIcon className="text-red-600" />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
