import { FaGoogle, FaFacebookF, FaEye, FaEyeSlash, FaLock, FaEnvelope } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AppDispatch } from "../../../store";
import { useState } from "react";
import { loginUser } from "../../../pages/AuthTemplate/slice";
import { toast } from "react-toastify";

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await dispatch(loginUser(user)).unwrap();
      toast.success("Đăng nhập thành công! 🎉");
      navigate("/");
    } catch (error: any) {
      toast.error(error || "Đăng nhập thất bại! ❌");
      console.error("Lỗi đăng nhập:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* Glass Card */}
      <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl py-8 px-12 transform transition-all duration-500 hover:bg-white/25">

        {/* Header */}
        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-white mb-2">
            Chào mừng trở lại
          </h1>
          <p className="text-white/70 text-base">
            Đăng nhập để tiếp tục hành trình của bạn
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <FaEnvelope className="h-5 w-5 text-white/60 group-focus-within:text-white/80 transition-colors" />
            </div>
            <input
              onChange={handleChange}
              type="email"
              name="email"
              id="email"
              placeholder="Nhập email của bạn"
              autoComplete="email"
              required
              className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/50 transition-all duration-300 hover:bg-white/15"
            />
          </div>

          {/* Password Field */}
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
              <FaLock className="h-5 w-5 text-white/60 group-focus-within:text-white/80 transition-colors" />
            </div>
            <input
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              autoComplete="current-password"
              required
              className="w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/50 transition-all duration-300 hover:bg-white/15"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-4 flex items-center z-10"
            >
              {showPassword ? (
                <FaEyeSlash className="h-5 w-5 text-white/60 hover:text-white/80 transition-colors" />
              ) : (
                <FaEye className="h-5 w-5 text-white/60 hover:text-white/80 transition-colors" />
              )}
            </button>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              to="/auth/forgotPass"
              className="text-white/80 hover:text-white text-sm font-medium transition-colors duration-200 hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full bg-[#0A2E50] hover:bg-[#E07B39] disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Đang đăng nhập...
              </div>
            ) : (
              "Đăng nhập"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="w-full border-t border-white/30"></div>
        </div>

        {/* Social Login Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/20 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0">
            <FaGoogle className="mr-2 text-lg" />
            <span className="hidden sm:inline">Google</span>
          </button>
          <button className="flex items-center justify-center bg-white/10 backdrop-blur-sm border border-white/30 hover:bg-white/20 text-white py-3 px-4 rounded-xl font-medium transition-all duration-300 hover:shadow-lg transform hover:-translate-y-0.5 active:translate-y-0">
            <FaFacebookF className="mr-2 text-lg" />
            <span className="hidden sm:inline">Facebook</span>
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="mt-8 text-center">
          <p className="text-white/70">
            Chưa có tài khoản?{" "}
            <Link
              to="/auth/register"
              className="text-white font-semibold hover:text-white/80 transition-colors duration-200 hover:underline"
            >
              Đăng ký ngay
            </Link>
          </p>
        </div>

        {/* Trust Badges */}

      </div>

      {/* Floating Particles */}
      <div className="absolute -top-10 -left-10 w-20 h-20 bg-white/5 rounded-full blur-xl animate-bounce delay-1000"></div>
      <div className="absolute -bottom-10 -right-10 w-16 h-16 bg-blue-400/10 rounded-full blur-lg animate-bounce delay-2000"></div>
      <div className="absolute top-1/2 -left-5 w-12 h-12 bg-purple-400/10 rounded-full blur-md animate-pulse"></div>
    </div>
  );
}