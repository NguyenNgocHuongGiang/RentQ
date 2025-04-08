import { useEffect, useState } from "react";
import { FaHome, FaClock, FaPlus, FaTimesCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../../store";
import { getAuthData } from "../../../../utils/helpers";
import {
  createRoleRequest,
  getUserRole,
} from "../../../../store/slice/userSlice";
import { ListingsProperty, RoleRequest } from "../../../../types/types";
import { toast } from "react-toastify";
import AddPostModal from "../../../../components/Modal/AddPostModal";
import PolicyModal from "../../../../components/Modal/PolicyModal";
import { FiEdit, FiEye, FiTrash2 } from "react-icons/fi";
import { Link } from "react-router-dom";
import { deletePosts, getUserListings } from "../../../../store/slice/postSlice";

export default function Posts() {
  const { data } = useSelector((state: any) => state.userReducer);
  const {listings} = useSelector((state: any) => state.postReducer);
  const dispatch = useDispatch<AppDispatch>();

  const [isOpen, setIsOpen] = useState(false);
  const [isOpenAdd, setIsOpenAdd] = useState(false);
  const [agreed, setAgreed] = useState(false);
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
      fetchData();
    }
  };

  const fetchData = () => {
    dispatch(getUserRole(user.userId)).unwrap();
    dispatch(getUserListings(user.userId))
      .unwrap()
  };

  const filteredData = Array.isArray(listings)
    ? listings.filter((listing: ListingsProperty) =>
        listing.address.toLowerCase().includes(searchTerm.toLowerCase())
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
                  placeholder="Search by address..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                  <table className="w-full text-sm rtl:text-right text-gray-500 text-center">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-200">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          Image
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Address
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Available From
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((listing: any) => (
                        <tr className="odd:bg-white even:bg-gray-50 border-b border-gray-200">
                          <td
                            scope="row"
                            className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                          >
                            <img
                              className="w-15 h-15 rounded-lg"
                              src={
                                listing.listing_images?.find(
                                  (item: any) => item.is_main
                                )?.image_url
                              }
                              alt="hinh anh"
                            />
                          </td>
                          <td className="px-6 py-2">{listing.address}</td>
                          <td className="px-6 py-2">{listing.price}</td>
                          <td className="px-6 py-2">
                            {listing.available_from
                              ? new Date(
                                  listing.available_from
                                ).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2 justify-center items-center h-full">
                              <Link
                                to = {`/detailpost/${listing.alias}`}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <FiEye size={20} />
                              </Link>
                              {/* <a
                                href="#"
                                className="text-yellow-500 hover:text-yellow-700"
                              >
                                <FiEdit size={20} />
                              </a> */}
                              <div
                                onClick={() => dispatch(deletePosts(listing.listing_id))}
                                className="text-red-500 hover:text-red-700 cursor-pointer"
                              >
                                <FiTrash2 size={20} />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
