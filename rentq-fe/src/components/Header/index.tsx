import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAuthData } from "../../utils/helpers";
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from "@headlessui/react";
import { getInfoUser } from "../../store/slice/userSlice";
import { AppDispatch } from "../../store";
import { useDispatch } from "react-redux";
import { FaBell, FaFacebookMessenger } from "react-icons/fa";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState("");
  const [role, setRole] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  const userData = getAuthData();  

  useEffect(() => {
    if (userData?.avatar) setAvatarUrl(userData.avatar);
    if (userData?.userRole) setRole(userData.userRole);
  }, [location]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (getAuthData()?.userRole !== "landlord") {
        checkRole(getAuthData().userId);
      }
    }, 2 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const checkRole = (id: number) => {
    try {
      dispatch(getInfoUser(id))
        .unwrap()
        .then((serverUser) => {
          const localUser = getAuthData();
          if (serverUser?.role !== localUser?.userRole) handleLogout();
        })
        .catch((error) => console.error("Failed to check role", error));
    } catch (error) {
      console.error("Failed to check role", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authInfo");
    navigate("/auth/login");
  };

  return (
    <nav className="bg-[#F0F2F5] sticky w-full z-20 top-0 start-0 shadow-md">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-2xl font-bold whitespace-nowrap text-[#0A2E50]">
            RentQ
          </span>
        </Link>

        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {avatarUrl ? (
            <div className="relative flex items-center gap-3">
              <div
                onClick={() => navigate("/message")}
                className="text-[#0A2E50] hover:text-[#E07B39] transition-colors duration-300 hover:cursor-pointer"
              >
                <FaFacebookMessenger size={22} />
              </div>
              <div className="text-[#0A2E50] hover:text-[#E07B39] transition-colors duration-300 hover:cursor-pointer">
                <FaBell size={22} />
              </div>
              <Menu as="div" className="relative inline-block text-left">
                <MenuButton className="focus:outline-none">
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full hover:cursor-pointer transition transform hover:scale-105"
                  />
                </MenuButton>
                <Transition
                  enter="transition ease-out duration-100"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-200 rounded-md bg-[#FFFFFF] shadow-lg ring-1 ring-black/10 focus:outline-none">
                    <div className="py-1">
                      <Link to={`/me/${userData?.userId}`}>
                        <MenuItem
                          as="button"
                          className="block w-full text-left px-4 py-2 text-sm text-[#0A2E50] hover:bg-[#E07B39] hover:text-white transition-colors duration-200"
                        >
                          Trang cá nhân
                        </MenuItem>
                      </Link>

                      <Link to="/me/user-information">
                        <MenuItem
                          as="button"
                          className="block w-full text-left px-4 py-2 text-sm text-[#0A2E50] hover:bg-[#E07B39] hover:text-white transition-colors duration-200"
                        >
                          Quản lý tài khoản
                        </MenuItem>
                      </Link>

                      {role === "landlord" ? (
                        <Link to="/manage/dashboard">
                          <MenuItem
                            as="button"
                            className="block w-full text-left px-4 py-2 text-sm text-[#0A2E50] hover:bg-[#E07B39] hover:text-white transition-colors duration-200"
                          >
                            Dashboard
                          </MenuItem>
                        </Link>
                      ) : role === "tenant" ? (
                        <Link to="/request-role">
                          <MenuItem
                            as="button"
                            className="block w-full text-left px-4 py-2 text-sm text-[#0A2E50] hover:bg-[#E07B39] hover:text-white transition-colors duration-200"
                          >
                            Request Landlord
                          </MenuItem>
                        </Link>
                      ) : null}
                      {/* <Link to="/settings">
                        <MenuItem
                          as="button"
                          className="block w-full text-left px-4 py-2 text-sm text-[#0A2E50] hover:bg-[#E07B39] hover:text-white transition-colors duration-200"
                        >
                          Settings
                        </MenuItem>
                      </Link> */}
                    </div>
                    <div className="py-1">
                      <MenuItem
                        as="button"
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-[#0A2E50] hover:bg-[#E07B39] hover:text-white transition-colors duration-200"
                      >
                        Logout
                      </MenuItem>
                    </div>
                  </MenuItems>
                </Transition>
              </Menu>
            </div>
          ) : (
            <>
              <button
                type="button"
                className="text-[#0A2E50] bg-[#FFFFFF] border-2 border-[#E07B39] hover:bg-[#E07B39] hover:text-white transition-colors duration-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center"
                onClick={() => navigate("/auth/login")}
              >
                Login
              </button>
              <button
                type="button"
                className="ml-3 text-white bg-[#E07B39] hover:bg-[#FFFFFF] hover:text-[#0A2E50] border-2 border-[#E07B39] transition-colors duration-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center"
                onClick={() => navigate("/auth/register")}
              >
                Sign up
              </button>
            </>
          )}
        </div>

        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium rounded-lg md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-[#F0F2F5]">
            {["/", "/tim-tro", "/cho-thue", "/o-ghep", "/lien-he"].map((path, index) => {
              const labels = ["Trang chủ", "Tìm trọ", "Cho thuê", "Ở ghép", "Liên hệ"];
              return (
                <li key={path}>
                  <Link
                    to={path}
                    className={`block py-2 px-3 rounded-sm md:p-0 transition-colors duration-300 ${location.pathname === path
                        ? "text-[#E07B39] font-semibold"
                        : "text-[#0A2E50] hover:text-[#E07B39]"
                      }`}
                    aria-current={location.pathname === path ? "page" : undefined}
                  >
                    {labels[index]}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>

  );
}
