import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store";
import { getAuthData } from "../../../../utils/helpers";
import { getInfoUser, updateInfoUser } from "../../../../store/slice/userSlice";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { Tabs } from "antd";
import BankAccount from "./BankAccount";

export default function UserProfile() {
  const dispatch = useDispatch<AppDispatch>();
  const { data: user } = useSelector((state: RootState) => state.userReducer);

  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = async () => {
    const userData = getAuthData();
    if (userData?.userId) {
      dispatch(getInfoUser(userData.userId)).unwrap();
    }
  };

  const formik = useFormik({
    initialValues: {
      full_name: user?.full_name || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
    },
    validationSchema: Yup.object({
      full_name: Yup.string().required("Full name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone must be exactly 10 digits")
        .required("Phone is required"),
      address: Yup.string().required("Address is required"),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      const userData = getAuthData();
      if (userData?.userId) {
        dispatch(updateInfoUser({ user_id: userData.userId, userData: values })).unwrap();
      }
      toast.success("Update successfully");
    },
  });


  return (
    <div className="w-full max-w-3xl mx-auto mt-3">
      <Tabs defaultActiveKey="1" className="custom-tabs" 
        tabBarGutter={32}>

        <Tabs.TabPane tab="User Information" key="1">
          <div className="flex flex-col items-center text-center w-full">
            <img
              src={user?.avatar_url}
              alt="Avatar"
              className="w-32 h-32 rounded-full border-4 border-gray-300"
            />
            <h2 className="text-2xl font-bold mt-4">{user?.full_name}</h2>

            <form
              onSubmit={formik.handleSubmit}
              className="mt-6 w-full max-w-md space-y-4"
            >
              <div className="flex flex-col text-left">
                <label className="font-medium">Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={formik.values.full_name}
                  onChange={formik.handleChange}
                  className="p-2 border rounded-lg"
                />
              </div>
              <div className="flex flex-col text-left">
                <label className="font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  className="p-2 border rounded-lg"
                  disabled
                />
              </div>
              <div className="flex flex-col text-left">
                <label className="font-medium">Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  className="p-2 border rounded-lg"
                />
              </div>
              <div className="flex flex-col text-left">
                <label className="font-medium">Address</label>
                <input
                  type="text"
                  name="address"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                  className="p-2 border rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#0A2E50] text-white p-3 mt-2 mb-5 rounded-lg hover:bg-[#E07B39] hover:font-bold hover:cursor-pointer"
              >
                Save Changes
              </button>
            </form>
          </div>
        </Tabs.TabPane>


        <Tabs.TabPane tab="Bank Account" key="2">
          <BankAccount />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
}
