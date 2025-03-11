import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function LoginPage() {
  return (
    <div className="relative border border-amber-50 bg-opacity-10 backdrop-blur-2xl w-3/4 max-w-sm mx-auto py-8 px-4 sm:px-6 md:px-8 rounded-lg shadow-lg z-10">
      <div className="flex min-h-full flex-col justify-center">
        <div className="mx-auto w-full max-w-sm">
          <h2 className="text-center text-3xl sm:text-4xl font-bold tracking-tight text-white">
            Login
          </h2>
        </div>
        <div className="mt-8 mx-auto w-full max-w-sm">
          <form className="space-y-6" action="#" method="POST">
            <div>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Enter email"
                autoComplete="email"
                required
                className="block w-full rounded-md py-2.5 text-base text-[#483507] outline-1 focus:outline-[#483507] sm:text-sm"
              />
            </div>

            <div>
              <input
                placeholder="Enter password"
                type="password"
                name="password"
                id="password"
                autoComplete="current-password"
                required
                className="block w-full rounded-md py-2.5 text-base text-[#483507] outline-1 focus:outline-[#483507] sm:text-sm"
              />
            </div>
            <div className="text-sm text-right">
              <a
                href="#"
                className="font-semibold text-white"
              >
                Forgot password?
              </a>
            </div>
            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-[#483507] px-3 py-3 text-sm font-semibold text-white shadow-xs hover:bg-[#8d702d] focus-visible:outline-[#8d702d]"
              >
                Login
              </button>
            </div>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <p className="mx-3 text-gray-50 text-sm">Or</p>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Đăng nhập bằng Google & Facebook */}
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
            <button className="flex-1 flex items-center justify-center bg-red-500 text-white py-2 rounded-md font-medium hover:bg-red-600 transition duration-300">
              <FaGoogle className="mr-2" /> Google
            </button>
            <button className="flex-1 flex items-center justify-center bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition duration-300">
              <FaFacebookF className="mr-2" /> Facebook
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-gray-50">
            Not a member?{" "}
            <Link
              to="/auth/register"
              className="font-semibold text-[#483507]"
            >
              Sign up
            </Link>{" "}
            now
          </p>
        </div>
      </div>
    </div>
  );
}