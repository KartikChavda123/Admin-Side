import React from "react";
import {
  PlayCircleOutline,
  Category,
  MenuBook,
  Inventory2,
  StoreMallDirectory,
  ContactSupport,
} from "@mui/icons-material";
import CollectionsIcon from "@mui/icons-material/Collections";

const DashBord = () => {
  const items = [
    { label: "Video", icon: <PlayCircleOutline fontSize="large" /> },

    { label: "Products", icon: <Inventory2 fontSize="large" /> },

    { label: "Contact Us", icon: <ContactSupport fontSize="large" /> },
  ];

  return (
    <div className="w-full min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-600">Dashboard</h1>
        <p className="text-gray-500">Gemini Microns</p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-6 bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition"
          >
            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-100 text-gray-600">
              {item.icon}
            </div>
            <span className="text-xl font-semibold text-gray-800">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashBord;
