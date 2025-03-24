import { useState } from "react";

export default function ChangePass() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSendOTP = () => {
    console.log("Sending OTP to:", email);
    setStep(2);
  };

  const handleVerifyOTP = () => {
    if (otp === "123456") {
      setStep(3);
    } else {
      alert("Invalid OTP");
    }
  };

  const handleChangePassword = () => {
    if (password === confirmPassword) {
      console.log("Password updated successfully");
      alert("Password changed successfully!");
    } else {
      alert("Passwords do not match");
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      {step === 1 && (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Enter your email</h2>
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            onClick={handleSendOTP}
            className="w-full bg-[#483507] text-white p-3 rounded-lg hover:bg-[#c2bdb5] hover:text-[#483507] hover:font-bold hover:cursor-pointer"
          >
            Send OTP
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Enter OTP</h2>
          <div className="mb-4">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            onClick={handleVerifyOTP}
            className="w-full bg-[#483507] text-white p-3 rounded-lg hover:bg-[#c2bdb5] hover:text-[#483507] hover:font-bold hover:cursor-pointer"
          >
            Verify OTP
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full p-2 border rounded"
            />
          </div>
          <button
            onClick={handleChangePassword}
            className="w-full bg-[#483507] text-white p-3 rounded-lg hover:bg-[#c2bdb5] hover:text-[#483507] hover:font-bold hover:cursor-pointer"
          >
            Change Password
          </button>
        </div>
      )}
    </div>
  );
}
