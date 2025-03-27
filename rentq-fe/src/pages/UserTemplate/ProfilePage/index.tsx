import { useState } from "react";
import { FaChevronDown } from "react-icons/fa"; // Icon mũi tên dropdown
import MyProfile from "./MyProfile";
import ChangePass from "./ChangePass";
import Posts from "./Posts";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false); // Kiểm soát dropdown Settings

  return (
    <div className="max-w-6xl mx-auto p-6 flex">
      {/* Sidebar */}
      <div className="w-1/6">
        <ul className="space-y-2">
          {/* Profile */}
          <li
            onClick={() => setActiveTab("profile")}
            className={`p-3 rounded-lg cursor-pointer ${
              activeTab === "profile"
                ? "bg-[#483507] text-white font-bold"
                : "bg-[#c2bdb5] hover:bg-[#483507] hover:text-white"
            }`}
          >
            Profile
          </li>

          {/* Your Posts */}
          <li
            onClick={() => setActiveTab("posts")}
            className={`p-3 rounded-lg cursor-pointer ${
              activeTab === "posts"
                ? "bg-[#483507] text-white font-bold"
                : "bg-[#c2bdb5] hover:bg-[#483507] hover:text-white"
            }`}
          >
            Posts
          </li>

          {/* Your Bills */}
          <li
            onClick={() => setActiveTab("bills")}
            className={`p-3 rounded-lg cursor-pointer ${
              activeTab === "bills"
                ? "bg-[#483507] text-white font-bold"
                : "bg-[#c2bdb5] hover:bg-[#483507] hover:text-white"
            }`}
          >
            Bills
          </li>

          {/* Settings Dropdown */}
          <li className="relative">
            <div
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
              className={`p-3 flex justify-between items-center rounded-lg cursor-pointer ${
                activeTab.includes("settings")
                  ? "bg-[#483507] text-white font-bold"
                  : "bg-[#c2bdb5] hover:bg-[#483507] hover:text-white"
              }`}
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
              <ul className="absolute left-0 w-full mt-2 bg-white border rounded-lg shadow-md">
                <li
                  onClick={() => {
                    setActiveTab("settings-password");
                    setIsSettingsOpen(false);
                  }}
                  className="p-3 hover:bg-gray-200 cursor-pointer hover:rounded-lg"
                >
                  Change Password
                </li>
                <li
                  onClick={() => {
                    setActiveTab("settings-notifications");
                    setIsSettingsOpen(false);
                  }}
                  className="p-3 hover:bg-gray-200 cursor-pointer hover:rounded-lg"
                >
                  Notifications
                </li>
              </ul>
            )}
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-5/6 min-h-96 p-6 ml-5 border rounded-lg shadow-md">
        {activeTab === "profile" && <MyProfile />}
        {activeTab === "posts" && <Posts />}
        {activeTab === "bills" && (
          <div>Bills</div>
        )}
        {activeTab === "settings-password" && (
          <ChangePass />
        )}
        {activeTab === "settings-notifications" && (
          <div>Notification settings...</div>
        )}
      </div>
    </div>
  );
}
