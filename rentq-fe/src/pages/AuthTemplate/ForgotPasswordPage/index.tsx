import React, { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setIsOtpSent(true);
    console.log("Sending OTP to:", email);
    // Call API gửi OTP ở đây
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Verifying OTP:", otp);
    // Call API xác thực OTP ở đây
  };

  return (
    <div className="relative bg-white bg-opacity-10 backdrop-blur-2xl w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl px-6 py-10 rounded-lg shadow-lg z-10 mx-auto">
      <div className="flex flex-col justify-center">
        <h2 className="text-center text-3xl sm:text-4xl font-bold tracking-tight text-[#483507]">
          Forgot Password
        </h2>

        <p className="text-center text-gray-600 mt-2 text-sm">
          {isOtpSent
            ? "Enter the OTP we sent to your email."
            : "Enter your email address and we'll send you a code to reset your password."}
        </p>

        <div className="mt-8">
          {!isOtpSent ? (
            // Gửi mã OTP
            <form className="space-y-6" onSubmit={handleSendCode}>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md py-2.5 px-4 text-base text-[#483507] border border-gray-300 placeholder:text-gray-400 focus:border-[#483507] sm:text-sm"
              />
              <button
                type="submit"
                className="hover:cursor-pointer w-full rounded-md bg-[#483507] px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#8d702d] focus:outline-none focus:ring-2 focus:ring-[#8d702d]"
              >
                Send Code
              </button>
            </form>
          ) : (
            // Nhập mã OTP
            <form className="space-y-6" onSubmit={handleVerifyOtp}>
              <input
                type="text"
                name="otp"
                placeholder="Enter OTP"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full rounded-md py-2.5 px-4 text-base text-[#483507] border border-gray-300 placeholder:text-gray-400 focus:border-[#483507] sm:text-sm tracking-[4px] text-center"
              />
              <button
                type="submit"
                className="hover:cursor-pointer w-full rounded-md bg-[#483507] px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#8d702d] focus:outline-none focus:ring-2 focus:ring-[#8d702d]"
              >
                Verify OTP
              </button>
            </form>
          )}

          <p className="mt-6 text-center text-sm text-gray-500">
            Remember your password?{" "}
            <Link
              to="/auth/login"
              className="font-semibold text-[#8d702d] hover:text-[#483507]"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
