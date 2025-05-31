import React, { useState } from "react";
import { Home, FileText, Settings, Archive, User } from "lucide-react";

function ProfileSidebar({ selectedIcon, setSelectedIcon }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const menuItems = [
    { icon: <Home size={20} />, label: "Home" },
    { icon: <FileText size={20} />, label: "Report" },
    { icon: <Archive size={20} />, label: "Archives" },
    { icon: <User size={20} />, label: "Profile" },
    { icon: <Settings size={20} />, label: "Settings" },
  ];

  return (
    <div
      className={`h-screen bg-white text-gray-800 p-4 shadow-md transition-all duration-300 ${isCollapsed ? "w-20" : "w-60"}`}
    >
      <button
        onClick={toggleSidebar}
        className={`text-gray-800 mb-6 ${!isCollapsed ? "" : " justify-center items-center w-full"} focus:outline-none`}
      >
        {isCollapsed ? "➤" : "⬅"}
      </button>
      <ul className="space-y-4">
        {menuItems.map((item, index) => (
          <li
            onClick={() => setSelectedIcon(item.label)}
            key={index}
            className={`flex ${isCollapsed ? "justify-center" : ""} cursor-pointer items-center space-x-4`}
          >
            <span
              className={`flex items-center ${selectedIcon === item.label ? "text-blue-700" : "text-gray-600"}`}
            >
              {React.cloneElement(item.icon, {
                color: selectedIcon === item.label ? "#2563eb" : "#4b5563",
              })}
            </span>
            {!isCollapsed && (
              <span
                className={
                  selectedIcon === item.label
                    ? "text-blue-700"
                    : "text-gray-600"
                }
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProfileSidebar;
