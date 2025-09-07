import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../../../store";
import { useEffect, useState } from "react";
import {
  getDetailPost,
  getReviewProperties,
  // getReviewListings,
} from "../../../store/slice/postSlice";
import { FaAngleRight, FaMapMarkerAlt, FaTag } from "react-icons/fa";
import Loading from "../../../components/Loading";
import "react-image-gallery/styles/css/image-gallery.css";
import { getInfoUser } from "../../../store/slice/userSlice";
import UtilitiesList from "./component/Utilities";
import { Button } from "antd";
import Review from "./component/Review";
import { toast } from "react-toastify";
import { getAuthData } from "../../../utils/helpers";
import { createMessage } from "../../../store/slice/messageSlice";
import { Dialog } from "@headlessui/react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const DetailPostPage = () => {
  const { alias } = useParams();
  const { loading, detailPost } = useSelector(
    (state: RootState) => state.postReducer
  );
  const state = useSelector((state: RootState) => state.userReducer);
  const inforHost = state?.data;  

  const dispatch = useDispatch<AppDispatch>();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (alias) {
      dispatch(getDetailPost(alias)).unwrap();
    }
  }, [alias, dispatch]);

  useEffect(() => {
    if (detailPost?.properties) {
      dispatch(
        getReviewProperties(detailPost?.properties?.property_id)
      ).unwrap();
      dispatch(getInfoUser(detailPost?.properties?.landlord_id)).unwrap();
    }
  }, [detailPost?.properties?.property_id, dispatch]);

  // xu ly Map
  const handleViewMap = () => {
    setIsOpen(true);
  };
  const closeModal = () => {
    setIsOpen(false);
  };

  // xu ly utilities
  const utilitiesArray = detailPost?.properties?.utilities
    .split(";")
    .map((item: string) => item.trim());

  // xy ly description
  const newDes = detailPost?.description?.trim();
  let shortDes = "";
  if (newDes) {
    shortDes = newDes.length > 300 ? newDes.slice(0, 300) + "..." : newDes;
  }
  const renderDescription = (description: string) => {
    return description.split("\\n").map((line, index) => (
      <span key={index}>
        {line.trim()}
        <br />
        {index < description.split("\\n").length - 1 && <br />}
      </span>
    ));
  };

  // xu ly image
  const images = (detailPost?.properties?.property_images || []).map(
    (img: any) => ({
      original: img.image_url || "/default-image.jpg",
      thumbnail: img.image_url || "/default-image.jpg",
    })
  );
  const mainImage =
    images.find(
      (_: any, index: number) =>
        detailPost?.properties?.property_images[index].is_main
    ) || images[0];
  const otherImages = images.filter((img: any) => img !== mainImage);

  // xu ly message
  const handleMessage = () => {
    const isLoggedIn = !!localStorage.getItem("authInfo");
    const hostInfo = {
      id: inforHost?.user_id,
      full_name: inforHost?.full_name,
      avatar_url: inforHost?.avatar_url,
    };

    if (isLoggedIn) {
      const newMessage = {
        sender_id: getAuthData()?.userId,
        receiver_id: inforHost?.user_id,
        receiver_full_name: inforHost?.full_name,
        receiver_avatar_url: inforHost?.avatar_url,
        content: "Hello! I am interested in your property.",
      };
      dispatch(createMessage(newMessage))
        .unwrap()
        .then(() => {
          navigate("/message", { state: hostInfo });
        })
        .catch((error) => {
          toast.error("Failed to send message: " + error.message);
        });
    } else {
      navigate("/auth/login");
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="max-w-7xl mx-auto p-4 ">
      <div className="min-h-fit">
        <div className="mt-4">
          {images.length === 1 && (
            <img
              src={images[0].original}
              alt={detailPost.title}
              className="w-full h-90 object-cover rounded-lg cursor-pointer"
              onClick={() => setIsGalleryOpen(true)}
            />
          )}

          {images.length === 2 && (
            <div className="grid grid-cols-2 gap-4">
              {images.map((img: any, index: number) => (
                <img
                  key={index}
                  src={img.original}
                  alt={detailPost.title}
                  className="w-full h-80 object-cover rounded-lg cursor-pointer"
                  onClick={() => setIsGalleryOpen(true)}
                />
              ))}
            </div>
          )}

          {images.length >= 3 && (
            <div className="grid grid-cols-5 gap-4 relative">
              <img
                src={mainImage?.original || "/default-image.jpg"}
                alt={detailPost.title}
                className="col-span-3 w-full h-85 object-cover rounded-lg cursor-pointer"
                onClick={() => setIsGalleryOpen(true)}
              />

              <div className="grid grid-rows-2 gap-4 col-span-2">
                {otherImages.slice(0, 2).map((img: any, index: number) => (
                  <img
                    key={index}
                    src={img.original}
                    alt={detailPost?.title}
                    className="w-full h-40 object-cover rounded-lg cursor-pointer"
                    onClick={() => setIsGalleryOpen(true)}
                  />
                ))}
              </div>

              {images.length > 3 && (
                <button
                  className="hover:cursor-pointer absolute bottom-2 right-2 bg-black text-white py-1 px-3 rounded-lg opacity-75 hover:opacity-100"
                  onClick={() => setIsGalleryOpen(true)}
                >
                  +{images.length - 3} images
                </button>
              )}
            </div>
          )}
        </div>

                {isGalleryOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
            <button
              className="absolute top-4 right-4 text-white text-2xl z-50"
              onClick={() => setIsGalleryOpen(false)}
            >
              ×
            </button>

            <div className="w-full max-w-4xl px-6">
              <Slider
                dots={true}
                infinite={true}
                speed={500}
                slidesToShow={1}
                slidesToScroll={1}
                arrows={true}
                adaptiveHeight={true}
              >
                {images.map((img: any, index: number) => (
                  <div key={index} className="flex justify-center">
                    <img
                      src={img.original}
                      alt={`Image ${index}`}
                      className="max-h-[80vh] object-contain rounded-lg"
                    />
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-8 py-5">
          <div className="lg:col-span-2 col-span-3">
            <div>
              <div className="mb-2">
                <h1 className="text-2xl font-bold mb-2">{detailPost?.title}</h1>
                <div className="flex">
                  <div className="mr-2">
                    Maximum: {detailPost?.properties?.max_people} people
                  </div>
                  <div className="">
                    - Area: {detailPost?.properties?.area} m²
                  </div>
                </div>
              </div>

              <div className="flex items-center text-gray-600 mb-2">
                <FaMapMarkerAlt className="mr-2 text-red-500 text-lg" />
                <span>{detailPost?.properties?.address}</span>
                <Button className="p-4 ml-3" onClick={handleViewMap}>
                  View map
                </Button>
              </div>

              <Dialog
                open={isOpen}
                onClose={closeModal}
                className="relative z-50"
              >
                {/* Background overlay */}
                <div className="fixed inset-0 bg-black/30" aria-hidden="true" />

                {/* Modal content */}
                <div className="fixed inset-0 flex items-center justify-center p-4">
                  <Dialog.Panel className="w-full max-w-4xl rounded bg-white p-4 shadow-xl">
                    <div className="relative w-full h-[500px]">
                      <iframe
                        className="absolute top-0 left-0 w-full h-full rounded"
                        loading="lazy"
                        allowFullScreen
                        src={`https://www.google.com/maps?q=${encodeURIComponent(
                          detailPost?.properties?.address
                        )}&output=embed`}
                      ></iframe>
                    </div>
                  </Dialog.Panel>
                </div>
              </Dialog>

              <p className="text-gray-800">
                {showMore
                  ? renderDescription(newDes)
                  : renderDescription(shortDes)}
              </p>
              {newDes?.length > 300 && (
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="flex items-center font-semibold my-5 underline cursor-pointer"
                >
                  {showMore ? "Show Less" : "Show More"} <FaAngleRight />
                </button>
              )}
            </div>

            <hr className="lg:mt-8 md:mt-6 sm:mt-4 text-gray-300" />

            {/* Utilities */}
            <div className="my-8">
              <h2 className="text-xl font-semibold">Utilities</h2>
              <UtilitiesList utilitiesArray={utilitiesArray} />
            </div>

            <hr className="lg:mt-8 md:mt-6 sm:mt-4 text-gray-300" />

            {/* Rating */}
            <Review />

            <hr className="lg:mt-8 md:mt-6 sm:mt-4 text-gray-300" />

            {/* Host */}
            <div className="my-8">
              <h2 className="text-xl font-semibold">Meet your host</h2>
              <div className="flex flex-col md:flex-row mt-5">
                {/* Left: Host Card */}
                <div className="bg-white flex items-center justify-center border border-gray-200 p-4 rounded-lg shadow-lg md:w-1/3 w-full">
                  <div className="text-center">
                    <img
                      src={inforHost?.avatar_url}
                      alt="Host Avatar"
                      className="w-16 h-16 rounded-full border-2 border-gray-300 mx-auto"
                    />
                    <p className="text-lg font-medium mt-2">
                      {inforHost?.full_name}
                    </p>
                  </div>
                </div>

                {/* Right: Host Information */}
                <div className="flex-1 ml-6 mt-2 md:mt-0">
                  <p className="text-gray-700 text-lg">
                    <strong>{inforHost?.full_name}</strong> is a Superhost.
                  </p>
                  <p className="text-md my-2 text-gray-00">
                    Superhosts are experienced, highly rated hosts who are
                    committed to providing great stays for guests.
                  </p>
                  <p className="text-gray-600 text-md mt-2">
                    Response rate: 100% <br />
                    Response time: Within hours
                  </p>

                  <button
                    className="cursor-pointer mt-5 px-4 py-2 bg-[#483507] text-white rounded-lg hover:bg-[#483507] hover:cursor-pointer"
                    onClick={() => {navigate(`/me/${inforHost?.user_id}`)}}
                  >
                    Xem trang cá nhân
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex flex-col col-span-1 rounded-lg p-4 sticky top-20 h-fit">
            <div className="flex items-center bg-white shadow-[0px_4px_6px_rgba(0,0,0,0.1)] border border-gray-100 rounded-lg p-3">
              <FaTag className="text-[#c2bdb5] mr-3" />
              <span className="text-gray-800 font-medium">
                The price does not include additional fees
              </span>
            </div>

            <div className="bg-white mt-8 border shadow-[0px_4px_6px_rgba(0,0,0,0.1)] border-gray-100 rounded-lg p-3">
              <div className="mb-4 flex flex-col items-center justify-center text-center border border-gray-300 p-5 rounded-lg">
                <div>
                  <span className="text-4xl mr-2 font-extrabold text-green-600 drop-shadow-md transform transition-transform hover:scale-110">
                    {detailPost?.price}
                  </span>
                  <span className="text-lg font-semibold text-gray-800">
                    VND/month
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  <p>
                    <strong>Available From:</strong>{" "}
                    {new Date(
                      detailPost?.properties?.available_from
                    ).toLocaleDateString()}
                  </p>
                </div>
                <button
                  className="mt-4 w-full bg-[#483507] text-white p-3 rounded-lg hover:bg-[#c2bdb5] hover:text-[#483507] hover:font-bold hover:cursor-pointer"
                  onClick={handleMessage}
                >
                  Message the host
                </button>
              </div>

              <div className="text-sm text-gray-600">
                <p className="text-center text-lg font-bold">
                  <strong>Rental Policies:</strong>
                </p>
                <ul className="list-disc pl-5 mt-3 leading-7">
                  <li>Monthly rent payment required</li>
                  <li>Security deposit is mandatory</li>
                  <li>Respect quiet hours from 10 PM to 7 AM</li>
                  <li>Maintain cleanliness in shared spaces</li>
                  <li>Follow building regulations and guidelines</li>
                  <li>
                    Additional fees such as electricity, water, and parking are
                    negotiable with the landlord
                  </li>
                  <li>
                    Pets are allowed with prior approval from the landlord
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailPostPage;
