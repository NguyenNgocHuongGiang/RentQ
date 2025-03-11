import { Outlet } from "react-router-dom";

export default function AuthTemplate() {
  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Hình nền với overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/background-auth.jpg')" }}
      ></div>
      <div className="absolute inset-0 bg-black opacity-30"></div> {/* Lớp phủ tối */}

      {/* Nội dung với nền trong suốt xám */}
        <Outlet />
      </div>
  );
}
