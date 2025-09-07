import { FaFacebookF, FaGoogle, FaUser, FaEnvelope, FaLock, FaPhone, FaMapMarkerAlt, FaEye, FaEyeSlash, FaUserPlus } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AppDispatch } from "../../../store";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { registerUser } from "../slice";

export default function RegisterPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      full_name: "",
      email: "",
      password: "",
      confirm_password: "",
      phone: "",
      address: "",
      role: "tenant",
    },
    validationSchema: Yup.object({
      full_name: Yup.string().required("Họ tên không được để trống"),
      email: Yup.string().email("Email không hợp lệ").required("Email không được để trống"),
      password: Yup.string()
        .min(6, "Mật khẩu phải có ít nhất 6 ký tự")
        .required("Mật khẩu không được để trống"),
      confirm_password: Yup.string()
        .oneOf([Yup.ref("password")], "Mật khẩu xác nhận không khớp")
        .required("Xác nhận mật khẩu không được để trống"),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Số điện thoại phải có đúng 10 chữ số")
        .required("Số điện thoại không được để trống"),
      address: Yup.string().required("Địa chỉ không được để trống"),
    }),
    enableReinitialize: true,
    onSubmit: async (values) => {
      const newUser = {
        full_name: values.full_name,
        email: values.email,
        password: values.password,
        phone: values.phone,
        address: values.address,
        role: values.role,
        is_verified: false,
      };

      setLoading(true);
      try {
        await dispatch(registerUser(newUser)).unwrap();
        toast.success("Đăng ký thành công! 🎉");
        toast.success("Vui lòng kiểm tra email để kích hoạt tài khoản.");
        navigate("/auth/login");
      } catch (error: any) {
        toast.error(error.message || "Đăng ký thất bại! ❌");
      } finally {
        setLoading(false);
      }
    },
  });

  useEffect(() => {
    Object.entries(formik.errors).forEach(([field, message]) => {
      if (formik.touched[field as keyof typeof formik.touched]) {
        toast.error(`${message}`);
      }
    });
  }, [formik.errors, formik.touched]);

  return (
    <div className="relative w-full max-w-2xl mx-auto px-4">
      {/* Glass Card */}
      <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl p-8 transform transition-all duration-500 hover:bg-white/25">

        {/* Header */}
        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-white mb-2">
            Tạo tài khoản mới
          </h1>
          <p className="text-white/70 text-base">
            Tham gia cộng đồng và khám phá những cơ hội tuyệt vời
          </p>
        </div>

        {/* Registration Form */}
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Row 1: Full Name & Email */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <FaUser className="h-5 w-5 text-white/60 group-focus-within:text-white/80 transition-colors" />
              </div>
              <input
                onChange={formik.handleChange}
                value={formik.values.full_name}
                type="text"
                name="full_name"
                id="full_name"
                placeholder="Họ và tên"
                required
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/50 transition-all duration-300 hover:bg-white/15"
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <FaEnvelope className="h-5 w-5 text-white/60 group-focus-within:text-white/80 transition-colors" />
              </div>
              <input
                onChange={formik.handleChange}
                value={formik.values.email}
                type="email"
                name="email"
                id="email"
                placeholder="Địa chỉ email"
                required
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/50 transition-all duration-300 hover:bg-white/15"
              />
            </div>
          </div>

          {/* Row 2: Password & Confirm Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <FaLock className="h-5 w-5 text-white/60 group-focus-within:text-white/80 transition-colors" />
              </div>
              <input
                onChange={formik.handleChange}
                value={formik.values.password}
                type={showPassword ? "text" : "password"}
                name="password"
                id="password"
                placeholder="Mật khẩu"
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

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <FaLock className="h-5 w-5 text-white/60 group-focus-within:text-white/80 transition-colors" />
              </div>
              <input
                onChange={formik.handleChange}
                value={formik.values.confirm_password}
                type={showConfirmPassword ? "text" : "password"}
                name="confirm_password"
                id="confirm_password"
                placeholder="Xác nhận mật khẩu"
                required
                className="w-full pl-12 pr-12 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/50 transition-all duration-300 hover:bg-white/15"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center z-10"
              >
                {showConfirmPassword ? (
                  <FaEyeSlash className="h-5 w-5 text-white/60 hover:text-white/80 transition-colors" />
                ) : (
                  <FaEye className="h-5 w-5 text-white/60 hover:text-white/80 transition-colors" />
                )}
              </button>
            </div>
          </div>

          {/* Row 3: Phone & Address */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <FaPhone className="h-5 w-5 text-white/60 group-focus-within:text-white/80 transition-colors" />
              </div>
              <input
                onChange={formik.handleChange}
                value={formik.values.phone}
                type="tel"
                name="phone"
                id="phone"
                placeholder="Số điện thoại"
                required
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/50 transition-all duration-300 hover:bg-white/15"
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <FaMapMarkerAlt className="h-5 w-5 text-white/60 group-focus-within:text-white/80 transition-colors" />
              </div>
              <input
                onChange={formik.handleChange}
                value={formik.values.address}
                type="text"
                name="address"
                id="address"
                placeholder="Địa chỉ"
                required
                className="w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/40 focus:border-white/50 transition-all duration-300 hover:bg-white/15"
              />
            </div>
          </div>


          {/* Register Button */}
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full bg-[#0A2E50] hover:bg-[#E07B39] disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Đang tạo tài khoản...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <FaUserPlus className="mr-2" />
                Tạo tài khoản
              </div>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-8">

          <div className="w-full border-t border-white/30"></div>

        </div>

        {/* Social Registration Buttons */}
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

        {/* Login Link */}
        <div className="mt-8 text-center">
          <p className="text-white/70">
            Đã có tài khoản?{" "}
            <Link
              to="/auth/login"
              className="text-white font-semibold hover:text-white/80 transition-colors duration-200 hover:underline"
            >
              Đăng nhập ngay
            </Link>
          </p>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="absolute top-1/2 -left-5 w-12 h-12 bg-green-400/10 rounded-full blur-md animate-pulse"></div>
      <div className="absolute bottom-1/4 -right-8 w-14 h-14 bg-teal-400/10 rounded-full blur-lg animate-pulse delay-1000"></div>
    </div>
  );
}