import { useEffect, useState } from "react";
import { FaHome, FaClock, FaTimesCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "./../../../store";
import { getAuthData } from "../../../utils/helpers";
import { createRoleRequest, getUserRole } from "../../../store/slice/userSlice";
import { RoleRequest } from "../../../types/types";
import { toast } from "react-toastify";
import PolicyModal from "../../../components/Modal/PolicyModal";

export default function RequestRole() {
  const { data } = useSelector((state: any) => state.userReducer);
  const dispatch = useDispatch<AppDispatch>();

  const [isOpen, setIsOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const user = getAuthData();

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [dispatch]);

  const handleSubmit = () => {
    if (agreed) {
      const user = getAuthData();
      const newRole = {
        user_id: user?.userId,
        status: "pending",
      };
      try {
        dispatch(createRoleRequest(newRole as RoleRequest)).unwrap();
        toast.success("Request sent successfully!");
      } catch (error: any) {
        toast.error(error.message);
      }
      setIsOpen(false);
    }
  };

  const fetchData = () => {
    dispatch(getUserRole(user.userId)).unwrap();
  };

  return (
    <div className="max-w-7xl flex p-6 gap-6 m-auto">
      <div className="w-2/3 bg-white rounded-lg border-1 shadow-md p-6">
        <div className="p-6 text-center ">
          {data == null && (
            <div>
              <div className="flex flex-col items-center justify-center mt-6">
                <FaHome className="w-24 h-24 text-gray-400 my-8" />
                <h3 className="text-xl font-semibold mb-4 text-[#483507]">
                  Are you a landlord looking to rent out your property?
                </h3>
              </div>

              <button
                onClick={() => setIsOpen(true)}
                className="mb-16 w-1/4 bg-[#483507] text-white p-3 rounded-lg hover:bg-[#c2bdb5] hover:text-[#483507] hover:font-bold hover:cursor-pointer"
              >
                Send request
              </button>
            </div>
          )}

          {data && data.status == "pending" && (
            <div className="flex flex-col items-center justify-center mt-6">
              <FaClock className="w-24 h-24 text-[#c2bdb5] my-8" />
              <div className="text-white bg-[#c2bdb5] p-4 px-8 rounded-lg text-lg font-bold">
                Your request has been submitted. We will review shortly...
              </div>
            </div>
          )}

          {data && data.status === "rejected" && (
            <div className="flex flex-col items-center justify-center mt-6">
              <FaTimesCircle className="w-24 h-24 text-red-500 my-8" />
              <div className="text-red-500 p-4 px-8 rounded-lg text-lg font-bold">
                Your request has been rejected. Please check the details or
                contact support for assistance.
              </div>
            </div>
          )}

          {isOpen && (
            <PolicyModal
              setIsOpen={setIsOpen}
              agreed={agreed}
              setAgreed={setAgreed}
              handleSubmit={handleSubmit}
            />
          )}
        </div>
      </div>

      <div className="w-1/3 bg-[#f9f6f2] rounded-lg shadow-md flex flex-col items-center text-left">
        <img
          src="https://media.12newsnow.com/assets/KJAC/images/537538906/537538906_1920x1080.jpg"
          alt="Promo"
          className="w-full h-auto mb-6 rounded-lg"
        />
        <div className="px-6 pb-6">
          <h2 className="text-2xl font-bold text-[#483507] mb-2 text-center">
            Join Our Community of Landlords
          </h2>
          <p className="text-[#6b4e2f] mb-3 text-sm leading-relaxed">
            Unlock the full potential of your property by listing it on our
            platform. Whether you're managing one apartment or multiple homes,
            we make it easy to reach thousands of verified renters in just a few
            clicks.
          </p>

          <div className="text-left text-[#6b4e2f] text-sm leading-relaxed space-y-3 mb-6  mt-1 ">
            <div className="flex items-center">
              <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center bg-[#483507] text-white text-xs font-bold rounded-full mr-4">
                1
              </div>
              <p className="flex-1">
                Click the <em>“Send request”</em> button to apply as a landlord.
              </p>
            </div>

            <div className="flex items-center">
              <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center bg-[#483507] text-white text-xs font-bold rounded-full  mr-4">
                2
              </div>
              <p className="flex-1">
                Wait for our team to review and approve your request.
              </p>
            </div>

            <div className="flex items-center">
              <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center bg-[#483507] text-white text-xs font-bold rounded-full  mr-4">
                3
              </div>
              <p className="flex-1">
                Once approved, you’ll be able to add your properties to the
                system.
              </p>
            </div>

            <div className="flex items-center">
              <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center bg-[#483507] text-white text-xs font-bold rounded-full  mr-4">
                4
              </div>
              <p className="flex-1">
                Start creating rental posts to reach potential tenants quickly!
              </p>
            </div>
          </div>

          <p className="text-[#6b4e2f] mb-6 text-sm leading-relaxed">
            Start advertising today and connect with high-quality tenants. It's
            simple, secure, and effective.
          </p>
        </div>
      </div>
    </div>
  );
}
