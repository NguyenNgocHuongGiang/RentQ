import { XCircle } from "lucide-react";

export default function VerifyFail() {
  return (
    <div className="flex flex-col items-center justify-center px-20 py-10 rounded-2xl bg-white z-10">
      <XCircle size={80} className="text-red-500" />
      <h1 className="text-2xl font-bold mt-4">Email Verification Failed!</h1>
      <p className="text-gray-600 mt-2">The link may be expired or invalid.</p>
      <div className="flex flex-col sm:flex-row items-center gap-2 mt-4 w-full">
        <input
          type="email"
          className="w-full sm:w-auto flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:outline-none"
          aria-describedby="emailHelpId"
          placeholder="Enter your email"
        />

        <button className="w-full sm:w-auto px-6 py-2 bg-red-500 text-white font-medium rounded-lg hover:bg-red-600 transition duration-300 ease-in-out">
          Resend
        </button>
      </div>
    </div>
  );
}
