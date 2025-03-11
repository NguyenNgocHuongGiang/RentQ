import React from "react";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function RegisterPage() {
  return (
    <div className="relative border border-amber-50  bg-opacity-10 backdrop-blur-2xl w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl px-6 py-10 rounded-lg shadow-lg z-10 mx-auto">
      <div className="flex flex-col justify-center">
        <h2 className="text-center text-3xl sm:text-4xl font-bold tracking-tight text-white">
          Sign Up
        </h2>

        <div className="mt-8">
          <form className="space-y-6">
            <div className="flex flex-wrap gap-4">
              <input
                type="text"
                name="full_name"
                id="full_name"
                placeholder="Full Name"
                required
                className="w-full sm:flex-1 rounded-md py-2.5 px-4 text-base text-[#483507] border border-gray-300 placeholder:text-gray-400 focus:border-[#483507] sm:text-sm"
              />
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Email"
                required
                className="w-full sm:flex-1 rounded-md py-2.5 px-4 text-base text-[#483507] border border-gray-300 placeholder:text-gray-400 focus:border-[#483507] sm:text-sm"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <input
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                required
                className="w-full sm:flex-1 rounded-md py-2.5 px-4 text-base text-[#483507] border border-gray-300 placeholder:text-gray-400 focus:border-[#483507] sm:text-sm"
              />
              <input
                type="password"
                name="confirm_password"
                id="confirm_password"
                placeholder="Confirm Password"
                required
                className="w-full sm:flex-1 rounded-md py-2.5 px-4 text-base text-[#483507] border border-gray-300 placeholder:text-gray-400 focus:border-[#483507] sm:text-sm"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <input
                type="tel"
                name="phone"
                id="phone"
                placeholder="Phone Number"
                required
                className="w-full sm:flex-1 rounded-md py-2.5 px-4 text-base text-[#483507] border border-gray-300 placeholder:text-gray-400 focus:border-[#483507] sm:text-sm"
              />
              <input
                type="text"
                name="address"
                id="address"
                placeholder="Address"
                required
                className="w-full sm:flex-1 rounded-md py-2.5 px-4 text-base text-[#483507] border border-gray-300 placeholder:text-gray-400 focus:border-[#483507] sm:text-sm"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-md bg-[#483507] px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#8d702d] focus:outline-none focus:ring-2 focus:ring-[#8d702d]"
            >
              Sign Up
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <p className="mx-3 text-gray-50 text-sm">Or</p>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
            <button className="flex-1 flex items-center justify-center bg-red-500 text-white py-2 rounded-md font-medium hover:bg-red-600 transition duration-300">
              <FaGoogle className="mr-2" /> Google
            </button>
            <button className="flex-1 flex items-center justify-center bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition duration-300">
              <FaFacebookF className="mr-2" /> Facebook
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-50">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="font-semibold text-[#483507]"
            >
              Login
            </Link>{" "}
            now
          </p>
        </div>
      </div>
    </div>
  );
}
