import { NavLink, Outlet } from "react-router-dom";
import {
  FaChevronDown,
  FaUser,
  FaInfoCircle,
  FaBookmark,
  FaFileContract,
  FaFileInvoiceDollar,
  FaCog,
  FaLock,
  FaBell,
  FaHome,
} from "react-icons/fa";
import { useState } from "react";

export default function Profile() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const menuItems = [
    {
      to: "/me/user-information",
      label: "Thông tin cá nhân",
      icon: FaInfoCircle,
      end: true,
    },
    { to: "/me/save-posts", label: "Bài đăng đã lưu", icon: FaBookmark },
    { to: "/me/contracts", label: "Hợp đồng thuê", icon: FaFileContract },
    { to: "/me/bills", label: "Hóa đơn thanh toán", icon: FaFileInvoiceDollar },
  ];

  const settingsItems = [
    { to: "/settings/password", label: "Đổi mật khẩu", icon: FaLock },
    { to: "/settings/notifications", label: "Thông báo", icon: FaBell },
  ];

  return (
    <div
      className="min-h-screen p-6"
      style={{
        background: "linear-gradient(90deg, #5B7295FF 0%, #0A2E50 100%)",
      }}
    >
      <div className="max-w-[1250px] mx-auto space-y-6">
        {/* Header */}
        <div className="bg-[#0A2E50] backdrop-blur-lg rounded-2xl p-6 flex items-center gap-4 shadow-xl border border-[#F0F2F5]/70">
          <div className="w-16 h-16 flex items-center justify-center bg-[#E07B39] rounded-full text-white text-2xl shadow-md">
            <FaHome />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Quản lý tài khoản
            </h1>
            <p className="text-[#F0F2F5] text-sm md:text-base mt-1">
              Quản lý thông tin cá nhân và hoạt động cho thuê nhà
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <aside className="w-full lg:w-80 flex-shrink-0 space-y-3">
            <div className="bg-white rounded-2xl p-5 shadow-md border border-gray-200">
              <ul className="space-y-2">
                {menuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <li key={index}>
                      <NavLink
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) =>
                          `flex items-center gap-3 p-4 rounded-xl text-sm md:text-base font-medium transition-transform duration-300 ease-in-out ${
                            isActive
                              ? "bg-[#0A2E50] text-[#FFFFFF] shadow-md -translate-y-1"
                              : "bg-[#F0F2F5] text-[#0A2E50] hover:bg-[#E07B39] hover:text-[#FFFFFF] hover:-translate-y-1 hover:shadow-md"
                          }`
                        }
                      >
                        <Icon className="text-base md:text-lg" />
                        {item.label}
                      </NavLink>
                    </li>
                  );
                })}

                {/* Settings Dropdown */}
                <li className="mt-4 pt-4 border-t border-gray-200 relative">
                  <button
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    className="w-full flex justify-between items-center p-4 rounded-xl bg-[#F0F2F5] text-[#0A2E50] font-medium text-sm md:text-base hover:bg-[#E07B39] hover:text-[#FFFFFF] transition-transform duration-300 ease-in-out"
                  >
                    <div className="flex items-center gap-3">
                      <FaCog className="text-base md:text-lg" />
                      Cài đặt
                    </div>
                    <FaChevronDown
                      className={`transition-transform duration-300 ${
                        isSettingsOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>

                  {isSettingsOpen && (
                    <ul className="mt-2 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden animate-slideDown">
                      {settingsItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                          <li key={index}>
                            <NavLink
                              to={item.to}
                              className={({ isActive }) =>
                                `flex items-center gap-3 p-3 text-sm md:text-base font-medium transition-colors duration-200 ${
                                  isActive
                                    ? "text-[#0A2E50] bg-[#F0F2F5]"
                                    : "text-[#0A2E50] hover:text-[#FFFFFF] hover:bg-[#E07B39]"
                                }`
                              }
                            >
                              <Icon className="text-base md:text-lg" />
                              {item.label}
                            </NavLink>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              </ul>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="bg-white rounded-2xl p-8 shadow-md border border-gray-200 min-h-[600px]">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {/* Tailwind animation */}
      <style>
        {`
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-slideDown {
            animation: slideDown 0.3s ease forwards;
          }
        `}
      </style>
    </div>
  );
}
