import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../../../store";
import { useEffect, useState } from "react";
import { addSavePost, deleteSavePost, getDetailPost } from "../../../store/slice/postSlice";
import Loading from "../../../components/Loading";
import { FaAngleRight, FaMapMarkerAlt, FaDollarSign, FaEye, FaStar, FaHeart, FaComment } from "react-icons/fa";
import UtilitiesList from "./component/Utilities";
import { getInfoUser } from "../../../store/slice/userSlice";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { toast } from "react-toastify";
import { createMessage } from "../../../store/slice/messageSlice";
import { getAuthData } from "../../../utils/helpers";
import { useOutletContext } from "react-router-dom";


type OutletContextType = {
  userSavePost: any[];
};

const MiniDetailPost = () => {
  const { alias } = useParams();
  const { loading, detailPost } = useSelector(
    (state: RootState) => state.postReducer
  );
  const state = useSelector((state: RootState) => state.userReducer);
  const inforHost = state?.data;
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const dispatch = useDispatch<AppDispatch>();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const navigate = useNavigate();
  const { userSavePost } = useOutletContext<OutletContextType>();

  useEffect(() => {
    if (alias) {
      dispatch(getDetailPost(alias)).unwrap();
    }
  }, [alias, dispatch]);

  useEffect(() => {
    if (detailPost?.properties) {
      dispatch(getInfoUser(detailPost?.properties?.landlord_id)).unwrap();
    }
  }, [detailPost?.properties?.property_id, dispatch]);

  useEffect(() => {
    if (detailPost?.post_id && userSavePost) {
      const saved = userSavePost.some(
        (p: any) => p.post_id === detailPost.post_id
      );
      setIsFavorite(saved);
    }
  }, [detailPost?.post_id, userSavePost]);

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

  // Format price function
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  // Format date function
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return <Loading />;
  }

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

  const handleSave = () => {
    const newSavePost = {
      user_id: getAuthData()?.userId,
      post_id: detailPost.post_id,
    };
    if (!isFavorite) {
      dispatch(addSavePost(newSavePost)).unwrap();
    } else {
      dispatch(deleteSavePost(newSavePost)).unwrap();
    }
    setIsFavorite((prev) => !prev);
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="min-h-fit">
        {/* Image Gallery */}
        <div className="mb-8">
          {images.length === 1 && (
            <img
              src={images[0].original}
              alt={detailPost.title}
              className="w-full h-85 object-cover rounded-2xl cursor-pointer shadow-lg"
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
                  className="w-full h-85 object-cover rounded-2xl cursor-pointer shadow-lg"
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
                className="col-span-3 w-full h-85 object-cover rounded-2xl cursor-pointer shadow-lg"
                onClick={() => setIsGalleryOpen(true)}
              />

              <div className="grid grid-rows-2 gap-4 col-span-2">
                {otherImages.slice(0, 2).map((img: any, index: number) => (
                  <img
                    key={index}
                    src={img.original}
                    alt={detailPost?.title}
                    className="w-full h-[160px] object-cover rounded-2xl cursor-pointer shadow-lg"
                    onClick={() => setIsGalleryOpen(true)}
                  />
                ))}
              </div>

              {images.length > 3 && (
                <button
                  className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white py-2 px-4 rounded-xl font-medium hover:bg-opacity-90 transition-all"
                  onClick={() => setIsGalleryOpen(true)}
                >
                  +{images.length - 3} ảnh khác
                </button>
              )}
            </div>
          )}
        </div>

        {isGalleryOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
            <button
              className="absolute top-4 right-4 text-white text-3xl z-50 hover:text-gray-300"
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
                      className="max-h-[80vh] w-full object-contain rounded-lg"
                    />
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        )}

        {/* Title and Basic Info */}
        <div className="mb-5">
          <h1 className="text-2xl font-bold mb-4 text-gray-900">{detailPost?.title}</h1>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center text-gray-700">
              <FaMapMarkerAlt className="mr-2 text-red-500" />
              <span>{detailPost?.properties?.address}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-6 text-lg text-gray-700">
            <div className="flex items-center">
              <span className="mr-2">Max: </span>
              <span><strong>{detailPost?.properties?.max_people}</strong> người</span>
            </div>
            <span className="text-gray-400">•</span>
            <div className="flex items-center">
              <span className="mr-2">Area: </span>
              <span><strong>{detailPost?.properties?.area}</strong> m²</span>
            </div>
          </div>
        </div>

        {/* Price and Availability Card */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-6 mb-8 shadow-lg">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            {/* Price Section */}
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-2">
                <FaDollarSign className="text-green-600 text-2xl" />
                <span className="text-4xl font-bold text-gray-900">
                  {formatPrice(detailPost?.price || 0)}
                </span>
                <span className="text-xl text-gray-600">/ tháng</span>
              </div>
            </div>

            {/* Availability Section */}
            <div className="flex-1">
              <div className="flex items-center justify-center mb-2">
                <span className="text-lg font-semibold text-gray-800">Ngày sẵn có: </span>

                <div className="text-md ml-2">
                  {formatDate(detailPost?.properties?.available_from || new Date().toISOString())}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            className="bg-[#0A2E50] cursor-pointer hover:bg-[#0e3b66] text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
            onClick={() => navigate(`/detailPost/${alias}`)}
          >
            <FaEye className="mr-2" />
            Xem chi tiết
          </button>

          <button onClick={handleMessage} className="border-2 cursor-pointer border-[#E07B39] hover:bg-[#E07B39] text-[#E07B39] hover:text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center">
            <FaComment className="mr-2" />
            Liên hệ chủ
          </button>

          <button onClick={handleSave} className="border-2 border-pink-500 hover:bg-pink-500 text-pink-500 hover:text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center">
            <FaHeart className="mr-2" />
            {isFavorite ? "Bỏ lưu" : "Lưu tin"}
          </button>
        </div>

        {/* Description */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Mô tả</h2>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <p className="text-gray-800 text-lg leading-relaxed">
              {showMore
                ? renderDescription(newDes)
                : renderDescription(shortDes)}
            </p>
            {newDes?.length > 300 && (
              <button
                onClick={() => setShowMore(!showMore)}
                className="flex items-center font-semibold mt-4 text-blue-600 hover:text-blue-800 underline cursor-pointer transition-colors"
              >
                {showMore ? "Thu gọn" : "Xem thêm"} <FaAngleRight className="ml-1" />
              </button>
            )}
          </div>
        </div>

        {/* Utilities */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Tiện ích</h2>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <UtilitiesList utilitiesArray={utilitiesArray} />
          </div>
        </div>

        {/* Host Information */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 text-gray-900">Gặp gỡ chủ nhà</h2>
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Host Avatar and Basic Info */}
              <div className="text-center md:text-left">
                <img
                  src={inforHost?.avatar_url}
                  alt="Host Avatar"
                  className="w-24 h-24 rounded-full border-4 border-gray-200 mx-auto md:mx-0 shadow-lg"
                />
                <h3 className="text-xl font-bold mt-4 text-gray-900">
                  {inforHost?.full_name}
                </h3>
                <div className="flex items-center justify-center md:justify-start mt-2">
                  <FaStar className="text-yellow-500 mr-1" />
                  <span className="text-sm font-semibold text-gray-700">Superhost</span>
                </div>
              </div>

              {/* Host Details */}
              <div className="flex-1">
                <p className="text-gray-700 text-lg mb-4">
                  <strong>{inforHost?.full_name}</strong> là một Superhost được tin tưởng.
                </p>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Superhost là những chủ nhà có kinh nghiệm, được đánh giá cao và cam kết
                  mang đến những trải nghiệm tuyệt vời cho khách thuê.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <span className="mr-2">📈</span>
                    <span className="text-gray-700">Tỷ lệ phản hồi: <strong>100%</strong></span>
                  </div>
                  <div className="flex items-center">
                    <span className="mr-2">⏱️</span>
                    <span className="text-gray-700">Phản hồi: <strong>Trong vài giờ</strong></span>
                  </div>
                </div>

                <button
                  className="bg-gray-900 hover:bg-gray-800 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                  onClick={() => navigate(`/me/${inforHost?.user_id}`)}
                >
                  Xem trang cá nhân
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Notice */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-start">
            <div className="text-amber-600 mr-3 text-2xl">🛡️</div>
            <div>
              <h4 className="font-bold text-amber-900 text-lg mb-2">Lưu ý an toàn</h4>
              <p className="text-amber-800">
                Để đảm bảo an toàn, hãy gặp trực tiếp chủ nhà và xem phòng trước khi thanh toán.
                Đừng chuyển tiền qua các ứng dụng thanh toán hoặc wire transfers trước khi xác nhận thông tin.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniDetailPost;