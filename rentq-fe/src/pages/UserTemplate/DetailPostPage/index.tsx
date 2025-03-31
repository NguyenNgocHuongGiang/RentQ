import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../../../store";
import { useEffect, useState } from "react";
import { getDetailListings } from "../../../store/slice/postSlice";
import { FaAngleRight, FaMapMarkerAlt, FaStar, FaTag } from "react-icons/fa";
import Loading from "../../../components/Loading";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { getInfoUser } from "../../../store/slice/userSlice";
import UtilitiesList from "../../../components/Modal/UtilitiesModal";
import { Button, Progress } from "antd";

const DetailPostPage = () => {
  const { alias } = useParams();
  const { data, loading } = useSelector(
    (state: RootState) => state.postReducer
  );
  const state = useSelector((state: RootState) => state.userReducer);
  const inforHost = state?.data;

  const dispatch = useDispatch<AppDispatch>();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (alias) {
      dispatch(getDetailListings(alias)).unwrap();
    }
  }, [alias, dispatch]);

  useEffect(() => {
    if (data?.landlord_id) {
      dispatch(getInfoUser(data?.landlord_id)).unwrap();
    }
  }, [data?.landlord_id, dispatch]);

  // xu ly utilities
  const utilitiesArray = data?.utilities
    .split(";")
    .map((item: string) => item.trim());

  // xy ly description
  const newDes = data?.description.trim();
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

  // xu ly rating
  const averageRating =
    data?.reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
    data?.reviews.length;

  // xu ly image
  const images = (data?.listing_images || []).map((img: any) => ({
    original: img.image_url || "/default-image.jpg",
    thumbnail: img.image_url || "/default-image.jpg",
  }));
  const mainImage =
    images.find(
      (_: any, index: number) => data.listing_images[index].is_main
    ) || images[0];
  const otherImages = images.filter((img: any) => img !== mainImage);

  if (loading) {
    return <Loading />;
  }

  const openGallery = () => {
    setIsGalleryOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 ">
      <div className="overflow-hidden">
        <div className="mt-4">
          {images.length === 1 && (
            <img
              src={images[0].original}
              alt={data.title}
              className="w-full h-90 object-cover rounded-lg cursor-pointer"
              onClick={openGallery}
            />
          )}

          {images.length === 2 && (
            <div className="grid grid-cols-2 gap-4">
              {images.map((img: any, index: number) => (
                <img
                  key={index}
                  src={img.original}
                  alt={data.title}
                  className="w-full h-80 object-cover rounded-lg cursor-pointer"
                  onClick={openGallery}
                />
              ))}
            </div>
          )}

          {images.length >= 3 && (
            <div className="grid grid-cols-5 gap-4 relative">
              <img
                src={mainImage?.original || "/default-image.jpg"}
                alt={data.title}
                className="col-span-3 w-full h-85 object-cover rounded-lg cursor-pointer"
                onClick={openGallery}
              />

              <div className="grid grid-rows-2 gap-4 col-span-2">
                {otherImages.slice(0, 2).map((img: any, index: number) => (
                  <img
                    key={index}
                    src={img.original}
                    alt={data.title}
                    className="w-full h-40 object-cover rounded-lg cursor-pointer"
                    onClick={openGallery}
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
            <ImageGallery
              items={images}
              showPlayButton={false}
              showFullscreenButton={true}
              onClose={() => setIsGalleryOpen(false)}
            />
          </div>
        )}

        <div className="grid grid-cols-3 gap-8 py-5">
          <div className="col-span-2">
            <div className="mb-2">
              <h1 className="text-2xl font-bold mb-2">{data?.title}</h1>
              <div className="flex">
                <div className="mr-2">Maximum: {data?.max_people} people</div>
                <div className="">- Area: {data?.area} m²</div>
              </div>
            </div>

            <div className="flex items-center text-gray-600 mb-2">
              <FaMapMarkerAlt className="mr-2 text-red-500 text-lg" />
              <span>{data?.address}</span>
              <Button className="p-4 ml-3" onClick={() => {}}>
                View map
              </Button>
            </div>

            <p className="text-gray-800">
              {showMore
                ? renderDescription(newDes)
                : renderDescription(shortDes)}
            </p>
            {newDes?.length > 300 && (
              <button
                onClick={() => setShowMore(!showMore)}
                className="flex items-center font-semibold mt-5 underline cursor-pointer"
              >
                {showMore ? "Show Less" : "Show More"} <FaAngleRight />
              </button>
            )}

            <hr className="lg:mt-8 md:mt-6 sm:mt-4 text-gray-300" />

            {/* Utilities */}
            <div className="my-8">
              <h2 className="text-xl font-semibold">Utilities</h2>
              <UtilitiesList utilitiesArray={utilitiesArray} />
            </div>

            <hr className="lg:mt-8 md:mt-6 sm:mt-4 text-gray-300" />

            {/* Rating */}
            <div className="my-8">
              <h2 className="text-xl font-semibold">Rating</h2>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg font-bold">
                  {averageRating.toFixed(1)}
                </span>
                <FaStar className="text-yellow-500" />
              </div>
              <Progress
                percent={(averageRating / 5) * 100}
                className="mb-4 w-full h-2"
              />
              <div className="space-y-4 my-6 grid grid-cols-2 gap-x-20">
                {data?.reviews.map((review: any) => (
                  <div key={review.review_id} className="py-2 rounded-lg">
                    <div className="flex">
                      <div className="mr-3 flex flex-col items-center justify-center">
                        <img
                          src={review.users.avatar_url}
                          alt=""
                          width={40}
                          height={40}
                          className="rounded-full border border-gray-100"
                        />
                      </div>
                      <div>
                        <p className="font-bold">{review.users.full_name}</p>
                        <p className="text-gray-500 text-xs my-1">
                          {new Date(review.created_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex mt-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < review.rating
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }
                          size={12}
                        />
                      ))}
                    </div>
                    <p className="mt-2">
                      {isExpanded
                        ? review.comment
                        : review.comment.slice(0, 50)}
                      {review.comment.length > 50 && (
                        <button
                          className="mt-2 underline"
                          onClick={() => setIsExpanded(!isExpanded)}
                        >
                          {isExpanded ? "Ẩn bớt" : "Xem thêm"}
                        </button>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <hr className="lg:mt-8 md:mt-6 sm:mt-4 text-gray-300" />

            {/* Host */}
            <div className="my-8">
              <h2 className="text-xl font-semibold">Meet your host</h2>
              <div className="flex mt-5">
                {/* Left: Host Card */}
                <div className="bg-white flex items-center justify-center border border-gray-200 p-4 rounded-lg shadow-lg w-1/3">
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
                <div className="flex-1 ml-6">
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
                  <button className="cursor-pointer mt-5 px-4 py-2 bg-[#483507] text-white rounded-lg hover:bg-[#483507] hover:cursor-pointer">
                    Message the host
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col col-span-1 rounded-lg p-4 lg:sticky lg:top-4">
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
                    {data?.price}
                  </span>
                  <span className="text-lg font-semibold text-gray-800">
                    VND/month
                  </span>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  <p>
                    <strong>Available From:</strong>{" "}
                    {new Date(data?.available_from).toLocaleDateString()}
                  </p>
                </div>
                <a
                  href="/host-info"
                  className="mt-4 bg-[#483507] text-white py-2 px-4 rounded-lg hover:bg-[#796a49]"
                >
                  Schedule an Appointment
                </a>
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
