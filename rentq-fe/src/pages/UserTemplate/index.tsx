import { Outlet } from "react-router-dom";
import Header from "../../component/Header";
import Footer from "../../component/Footer";
import { useEffect } from "react";

export default function UserTemplate() {
  useEffect(() => {
    document.title = "RentQ";
  }, []);
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1"> 
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}
