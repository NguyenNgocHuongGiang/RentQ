import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAuthData } from "../../utils/helpers";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { getInfoUser } from "../../store/slice/userSlice";
import { AppDispatch } from "../../store";
import { useDispatch } from "react-redux";
import { FaBell, FaFacebookMessenger, FaInbox, FaInfo, FaRing } from "react-icons/fa";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [avatarUrl, setAvatarUrl] = useState("");
  const [role, setRole] = useState("");
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const userData = getAuthData();
    if (userData?.avatar) {
      setAvatarUrl(userData.avatar);
    }
    if (userData?.userRole) {
      setRole(userData.userRole);
    }
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
          if (serverUser?.role !== localUser?.userRole) {
            handleLogout();
          }
        })
        .catch((error) => {
          console.error("Failed to check role", error);
        });
    } catch (error) {
      console.error("Failed to check role", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("authInfo");
    navigate("/auth/login");
  };

  return (
    <nav className="bg-[#c2bdb5] sticky w-full z-20 top-0 start-0">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse"
        >
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-[#483507]">
            RentQ
          </span>
        </Link>

        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {avatarUrl ? (
            <div className="relative flex items-center gap-3">
              <div onClick={() => navigate("/message")} className="text-[#483507] hover:text-white bg-transparent hover:bg-[#483507] focus:ring-4 focus:outline-none focus:ring-[#483507] font-medium rounded-full text-sm px-1.5 py-1.5 text-center border-[#483507] border-2 hover:cursor-pointer transition duration-300 transform hover:scale-105">
                <FaFacebookMessenger size={22} />
              </div>
              <div className="text-[#483507] hover:text-white bg-transparent hover:bg-[#483507] focus:ring-4 focus:outline-none focus:ring-[#483507] font-medium rounded-full text-sm px-1.5 py-1.5 text-center border-[#483507] border-2 hover:cursor-pointer transition duration-300 transform hover:scale-105">
                <FaBell size={22} />
              </div>
              <Menu as="div" className="relative inline-block text-left">
                <MenuButton className="focus:outline-none">
                  <img
                    src={avatarUrl}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full hover:cursor-pointer"
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
                  <MenuItems className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none">
                    <div className="py-1">
                      <Link to="/me">
                        <MenuItem
                          as="button"
                          className="hover:cursor-pointer block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Profile
                        </MenuItem>
                      </Link>
                      {role === "landlord" ? (
                        <Link to="/manage/dashboard">
                          <MenuItem
                            as="button"
                            className="hover:cursor-pointer block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Dashboard
                          </MenuItem>
                        </Link>
                      ) : role === "tenant" ? (
                        <Link to="/request-role">
                          <MenuItem
                            as="button"
                            className="hover:cursor-pointer block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Request Landlord
                          </MenuItem>
                        </Link>
                      ) : null}
                      <Link to="/settings">
                        <MenuItem
                          as="button"
                          className="hover:cursor-pointer block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          Settings
                        </MenuItem>
                      </Link>
                    </div>
                    <div className="py-1">
                      <MenuItem
                        as="button"
                        onClick={handleLogout}
                        className="hover:cursor-pointer block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
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
                className="mr-5 text-[#483507] hover:text-white bg-transparent hover:bg-[#483507] focus:ring-4 focus:outline-none focus:ring-[#483507] font-medium rounded-lg text-sm px-4 py-2 text-center border-[#483507] border-2 hover:cursor-pointer transition duration-300 transform hover:scale-105"
                onClick={() => navigate("/auth/login")}
              >
                Login
              </button>
              <button
                type="button"
                className="text-white bg-[#483507] hover:bg-transparent focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 text-center border-[#483507] border-2 hover:text-[#483507] hover:cursor-pointer transition duration-300 transform hover:scale-105"
                onClick={() => navigate("/auth/register")}
              >
                Sign up
              </button>
            </>
          )}
        </div>

        <div className="items-center justify-between hidden w-full md:flex md:w-auto md:order-1">
          <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium rounded-lg md:space-x-8 md:flex-row md:mt-0 md:border-0 md:bg-[#c2bdb5]">
            {["/", "/discovery", "/services", "/contact"].map((path, index) => {
              const labels = ["Home", "Discovery", "Services", "Contact"];
              return (
                <li key={path}>
                  <Link
                    to={path}
                    className={`block py-2 px-3 rounded-sm md:p-0 transition duration-300 transform hover:scale-105 ${
                      location.pathname === path
                        ? "text-[#483507] font-bold"
                        : "text-white hover:bg-gray-100 md:hover:bg-transparent md:hover:text-[#483507]"
                    }`}
                    aria-current={
                      location.pathname === path ? "page" : undefined
                    }
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
