import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { AppDispatch } from "../../../store";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { registerUser } from "../slice";

export default function RegisterPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

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
      full_name: Yup.string().required("Full name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      password: Yup.string().required("Password is required"),
      confirm_password: Yup.string()
        .oneOf([Yup.ref("password")], "Passwords must match")
        .required("Confirm Password is required"),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone must be exactly 10 digits")
        .required("Phone is required"),
      address: Yup.string().required("Address is required"),
    }),
    enableReinitialize: true,
    // validateOnChange: true,
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

      try {
        await dispatch(registerUser(newUser)).unwrap();
        toast.success("Đăng ký thành công");
        toast.success("Vui lòng kiểm tra email để kích hoạt tài khoản.");
        navigate("/auth/login");
      } catch (error: any) {
        toast.error(error.message);
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
    <div className="relative bg-white bg-opacity-10 backdrop-blur-2xl w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl px-6 py-10 rounded-lg shadow-lg z-10 mx-auto">
      <div className="flex flex-col justify-center">
        <h2 className="text-center text-3xl sm:text-4xl font-bold tracking-tight text-[#483507]">
          Sign Up
        </h2>

        <div className="mt-8">
          <form className="space-y-6" onSubmit={formik.handleSubmit}>
            <div className="flex flex-wrap gap-4">
              <input
                onChange={formik.handleChange}
                value={formik.values.full_name}
                type="text"
                name="full_name"
                id="full_name"
                placeholder="Full Name"
                required
                className="w-full sm:flex-1 rounded-md py-2.5 px-4 text-base text-[#483507] border border-gray-300 placeholder:text-gray-400 focus:border-[#483507] sm:text-sm"
              />
              <input
                onChange={formik.handleChange}
                value={formik.values.email}
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
                onChange={formik.handleChange}
                value={formik.values.password}
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                required
                className="w-full sm:flex-1 rounded-md py-2.5 px-4 text-base text-[#483507] border border-gray-300 placeholder:text-gray-400 focus:border-[#483507] sm:text-sm"
              />
              <input
                onChange={formik.handleChange}
                value={formik.values.confirm_password}
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
                onChange={formik.handleChange}
                value={formik.values.phone}
                type="tel"
                name="phone"
                id="phone"
                placeholder="Phone Number"
                required
                className="w-full sm:flex-1 rounded-md py-2.5 px-4 text-base text-[#483507] border border-gray-300 placeholder:text-gray-400 focus:border-[#483507] sm:text-sm"
              />
              <input
                onChange={formik.handleChange}
                value={formik.values.address}
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
              className="hover:cursor-pointer w-full rounded-md bg-[#483507] px-4 py-3 text-sm font-semibold text-white shadow-md hover:bg-[#8d702d] focus:outline-none focus:ring-2 focus:ring-[#8d702d]"
            >
              Sign Up
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <p className="mx-3 text-gray-500 text-sm">Or</p>
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

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              to="/auth/login"
              className="font-semibold text-[#8d702d] hover:text-[#483507]"
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
