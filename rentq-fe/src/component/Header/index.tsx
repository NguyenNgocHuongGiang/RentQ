import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const location = useLocation();

  return (
    <nav className="bg-[#c2bdb5] sticky w-full z-20 top-0 start-0">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-[#483507]">
            RentQ
          </span>
        </Link>
        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <button
            type="button"
            className="mr-5 text-[#483507] hover:text-white bg-transparent hover:bg-[#483507] focus:ring-4 focus:outline-none focus:ring-[#483507] font-medium rounded-lg text-sm px-4 py-2 text-center border border-[#483507] border-2 hover:cursor-pointer transition duration-300 transform hover:scale-105"
          >
            Login
          </button>
          <button
            type="button"
            className="text-white bg-[#483507] hover:bg-transparent focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 text-center border border-[#483507] border-2 hover:text-[#483507] hover:cursor-pointer transition duration-300 transform hover:scale-105"
          >
            Sign up
          </button>
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
