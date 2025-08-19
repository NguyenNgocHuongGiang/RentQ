import { NavLink, Outlet } from "react-router-dom";
import { FaChevronDown } from "react-icons/fa";
import { useState } from "react";

export default function Profile() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto p-6 flex">
      {/* Sidebar */}
      <div className="w-1/4 py-2">
        <ul className="space-y-2">
          {/* Profile */}
          <li>
            <NavLink
              to="/me"
              end
              className={({ isActive }) =>
                `block p-3 rounded-lg cursor-pointer transition duration-300 ease-in-out ${
                  isActive
                    ? "bg-[#483507] text-white font-semibold shadow-lg border-b-4 border-[#a57d38]"
                    : "hover:bg-[#483507] hover:text-white hover:scale-105 bg-[#c2bdb5]"
                }`
              }
            >
              Profile
            </NavLink>
          </li>

          {/* User Information */}
          <li>
            <NavLink
              to="/me/user-information"
              end
              className={({ isActive }) =>
                `block p-3 rounded-lg cursor-pointer transition duration-300 ease-in-out ${
                  isActive
                    ? "bg-[#483507] text-white font-semibold shadow-lg border-b-4 border-[#a57d38]"
                    : "hover:bg-[#483507] hover:text-white hover:scale-105 bg-[#c2bdb5]"
                }`
              }
            >
              User Information
            </NavLink>
          </li>

          {/* Your Posts */}
          <li>
            <NavLink
              to="/me/save-posts"
              className={({ isActive }) =>
                `block p-3 rounded-lg cursor-pointer transition duration-300 ease-in-out ${
                  isActive
                    ? "bg-[#483507] text-white font-semibold shadow-lg border-b-4 border-[#a57d38]"
                    : "hover:bg-[#483507] hover:text-white hover:scale-105 bg-[#c2bdb5]"
                }`
              }
            >
              Save posts
            </NavLink>
          </li>

          {/* Your Contracts */}
          <li>
            <NavLink
              to="/me/contracts"
              className={({ isActive }) =>
                `block p-3 rounded-lg cursor-pointer transition duration-300 ease-in-out ${
                  isActive
                    ? "bg-[#483507] text-white font-semibold shadow-lg border-b-4 border-[#a57d38]"
                    : "hover:bg-[#483507] hover:text-white hover:scale-105 bg-[#c2bdb5]"
                }`
              }
            >
              Contracts
            </NavLink>
          </li>

          {/* Your Bills */}
          <li>
            <NavLink
              to="/me/bills"
              className={({ isActive }) =>
                `block p-3 rounded-lg cursor-pointer transition duration-300 ease-in-out ${
                  isActive
                    ? "bg-[#483507] text-white font-semibold shadow-lg border-b-4 border-[#a57d38]"
                    : "hover:bg-[#483507] hover:text-white hover:scale-105 bg-[#c2bdb5]"
                }`
              }
            >
              Bills
            </NavLink>
          </li>

          {/* Settings Dropdown */}
          <li className="relative">
            <div
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className="p-3 bg-[#c2bdb5] flex justify-between items-center rounded-lg cursor-pointer hover:bg-[#483507] hover:text-white transition duration-300 ease-in-out"
            >
              Settings
              <FaChevronDown
                className={`transition-transform ${
                  isSettingsOpen ? "rotate-180" : "rotate-0"
                }`}
              />
            </div>

            {/* Dropdown Content */}
            {isSettingsOpen && (
              <ul className="absolute left-0 w-full mt-2 bg-white text-black border border-gray-300 rounded-lg shadow-md transition duration-300 ease-in-out">
                <li>
                  <NavLink
                    to="/settings/password"
                    className={({ isActive }) =>
                      `block p-3 hover:bg-gray-200 cursor-pointer rounded-lg transition duration-200 ease-in-out ${
                        isActive ? "font-semibold" : ""
                      }`
                    }
                  >
                    Change Password
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/settings/notifications"
                    className={({ isActive }) =>
                      `block p-3 hover:bg-gray-200 cursor-pointer rounded-lg transition duration-200 ease-in-out ${
                        isActive ? "font-semibold" : ""
                      }`
                    }
                  >
                    Notifications
                  </NavLink>
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-3/4 ml-5 p-6 border rounded-lg shadow-md">
        <Outlet />
      </div>
    </div>
  );
}
