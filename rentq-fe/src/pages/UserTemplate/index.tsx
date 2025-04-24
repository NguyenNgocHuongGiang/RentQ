import { Outlet } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

export default function UserTemplate() {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    document.title = "RentQ";

    const handleScroll = () => {
      setShowButton(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />

      {showButton && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-5 rounded-lg cursor-pointer right-5 bg-[#483507] text-white w-12 h-12 shadow-md hover:shadow-xl transition-all duration-300 z-50 flex items-center justify-center"
          title="Back to top"
        >
          <FaArrowUp className="text-lg" />
        </button>
      )}
    </div>
  );
}
