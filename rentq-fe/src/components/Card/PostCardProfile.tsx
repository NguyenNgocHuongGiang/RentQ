import React from "react";
import { ActivePostType, PostsType } from "../../types/types";
import { FaMapMarkerAlt, FaEye } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";

interface PostCardProfileProps {
  item: ActivePostType | PostsType;
}

export const PostCardProfile: React.FC<PostCardProfileProps> = ({ item }) => {
  const mainImage =
    item?.properties?.property_images?.find((img) => img.is_main) ||
    item?.properties?.property_images?.[0];

  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = async () => {
    if (location.pathname.startsWith("/me")) {
      navigate(`/detailpost/${item.alias}`);
    } else {
      navigate(`/cho-thue/detail/${item.alias}`);
    }
  };

  return (
    <div
      className="group h-105 relative rounded-2xl overflow-hidden shadow-lg bg-white mb-6 cursor-pointer transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] border border-gray-100"
      onClick={handleClick}
    >
      {/* Image Section with Overlay */}
      <div className="relative overflow-hidden">
        {mainImage ? (
          <>
            <img
              src={mainImage.image_url}
              alt="post"
              className="w-full h-56 object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Price Badge */}
            <div className="absolute top-4 right-4 bg-gradient-to-r from-[#E07B39] to-[#ff8c42] text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg transform transition-transform duration-300 group-hover:scale-105">
              {item.price ? `${item.price.toLocaleString()} VND` : "Liên hệ"}
            </div>

            {/* View Icon */}
            <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <FaEye className="text-[#E07B39] text-sm" />
            </div>
          </>
        ) : (
          <div className="w-full h-56 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <div className="w-16 h-16 mx-auto mb-2 bg-gray-300 rounded-full flex items-center justify-center">
                <FaMapMarkerAlt className="text-2xl" />
              </div>
              <p className="text-sm">Không có hình ảnh</p>
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 relative">
        {/* Address with Icon */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-shrink-0 mt-1 p-3 bg-gradient-to-r from-[#E07B39]/10 to-[#ff8c42]/10 rounded-full">
            <FaMapMarkerAlt className="text-[#E07B39] text-md" />
          </div>
          <div className="flex-grow">
            <h3 className="font-bold text-lg text-gray-800 leading-tight group-hover:text-[#E07B39] transition-colors duration-300">
              {item.properties?.address || "Địa chỉ chưa có"}
            </h3>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              Area: {item.properties?.area} m² | Max: {item.properties?.max_people} people
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
          {item.description || "Không có mô tả chi tiết."}
        </p>
      </div>

      {/* Hover Border Effect */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#E07B39]/20 rounded-2xl transition-all duration-300" />
    </div>
  );
};