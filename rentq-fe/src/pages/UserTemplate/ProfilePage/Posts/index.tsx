import { useEffect, useState } from "react";
import { FaHome, FaClock, FaPlus, FaTimesCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../../store";
import { getAuthData } from "../../../../utils/helpers";
import {
  createRoleRequest,
  getUserListings,
  getUserRole,
} from "../../../../store/slice/userSlice";
import { ListingsProperty, RoleRequest } from "../../../../types/types";
import { toast } from "react-toastify";
import AddPostModal from "../../../../components/Modal/AddPostModal";
import PostCard from "../../../../components/Card/PostCard";
import PolicyModal from "../../../../components/Modal/PolicyModal";

export default function Posts() {
  const { data } = useSelector((state: any) => state.userReducer);
  const dispatch = useDispatch<AppDispatch>();

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [listings, setUserListings] = useState<ListingsProperty[]>();
  const [searchTerm, setSearchTerm] = useState("");

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

  const handlePostCreated = (newPost: ListingsProperty) => {
    if (newPost) {
      setUserListings((prevListings) => [...(prevListings || []), newPost]);
      fetchData();
    }
  };

  const fetchData = () => {
    dispatch(getUserRole(user.userId)).unwrap();
    dispatch(getUserListings(user.userId))
      .unwrap()
      .then((data) => setUserListings(data));
  };

  const filteredData = Array.isArray(listings)
    ? listings.filter((listing: ListingsProperty) =>
        listing.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
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
            Your request has been rejected. Please check the details or contact
            support for assistance.
          </div>
        </div>
      )}

      {data && data.status == "approved" && (
        <div>
          {(listings ?? []).length > 0 ? (
            <div>
              <div className="flex justify-between mb-4">
                <button
                  onClick={() => setIsOpenAdd(true)}
                  className="bg-[#483507] flex justify-center items-center text-white py-2 px-3 rounded-lg hover:bg-[#c2bdb5] hover:text-[#483507] hover:font-bold hover:cursor-pointer"
                >
                  <FaPlus />
                  <p className="ml-3">Add new post</p>
                </button>
                <input
                  type="text"
                  className="w-1/2 border border-gray-300 rounded-lg"
                  placeholder="Search by title"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredData.map((listing: ListingsProperty) => (
                  <PostCard key={listing.listing_id} listing={listing} />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-[#483507] p-4 rounded-lg text-center">
              <p className="text-3xl font-bold">Hello!</p>
              <p className="text-xl my-3">Your request has been approved!</p>
              <p className="mb-4 text-lg">
                Start creating your first post now.
              </p>
              <button
                onClick={() => setIsOpenAdd(true)}
                className="bg-[#483507] text-white p-5 rounded-lg hover:bg-[#c2bdb5] hover:text-[#483507] hover:font-bold hover:cursor-pointer"
              >
                <FaPlus />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal policy*/}
      {isOpen && (
        <PolicyModal
          setIsOpen={setIsOpen}
          agreed={agreed}
          setAgreed={setAgreed}
          handleSubmit={handleSubmit}
        />
      )}

      {/* Modal add post */}
      {isOpenAdd && (
        <AddPostModal
          setIsOpenAdd={setIsOpenAdd}
          onPostCreated={handlePostCreated}
        />
      )}
    </div>
  );
}
