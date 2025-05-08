import React from "react";
import { PostsType } from "../../types/types";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import { FaMapMarkerAlt, FaHeart } from "react-icons/fa";
import { Tooltip } from "antd";
import { getAuthData } from "../../utils/helpers";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { addSavePost, deleteSavePost } from "../../store/slice/postSlice";

interface PostCardHorizontalProps {
  item: PostsType;
  isSave?: boolean;
}

export const PostCardHorizontal: React.FC<PostCardHorizontalProps> = ({
  item,
  isSave,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const mainImage =
    item?.properties?.property_images?.find((img) => img.is_main) ||
    item?.properties?.property_images?.[0];
    const [isFavorite, setIsFavorite] = React.useState<boolean>(false);

    const handleFavoriteClick = (e: React.MouseEvent, post_id: number) => {
      e.stopPropagation();
      const newSavePost = {
        user_id: getAuthData()?.userId,
        post_id,
      };
      if (!isFavorite) {
        dispatch(addSavePost(newSavePost)).unwrap();
      } else {
        dispatch(deleteSavePost(newSavePost)).unwrap();
      }
      setIsFavorite((prev) => !prev);
    };

  return (
    <div
      className="cursor-pointer relative border border-gray-200 rounded-lg px-4 py-4 shadow-md bg-white flex flex-row hover:shadow-lg transition-shadow duration-200"
      onClick={() => {
        navigate(`/detailpost/${item.alias}`);
      }}
    >
      {/* Heart icon */}
      <div
        className={`absolute p-2 top-0 right-0 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ${
          isSave ? "bg-red-500 text-white" : "bg-gray-400 text-white"
        }`}
        onClick={(e) => item.post_id !== undefined && handleFavoriteClick(e, item.post_id)}
      >
        <FaHeart size={20} />
      </div>

      {/* Image */}
      <img
        src={mainImage?.image_url}
        alt="post"
        className="w-40 h-32 object-cover rounded-md mr-4"
      />

      {/* Info */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center mb-2">
          <FaMapMarkerAlt className="mr-2 text-red-500 text-md" size={20} />
          <Tooltip title={item.properties?.address}>
            <h2 className="text-lg font-bold">
              {(item.properties?.address ?? "").length > 55
                ? `${(item.properties?.address ?? "").slice(0, 52)}...`
                : item.properties?.address}
            </h2>
          </Tooltip>
        </div>
        <div className="flex flex-row space-x-2 text-gray-500 text-sm mb-2">
          <div>
            <span className="text-gray-500 text-sm">Area: </span>
            <span className="text-md font-semibold">
              {item?.properties?.area} m²
            </span>
          </div>
          <div>|</div>
          <div>
            <span className="text-gray-500 text-sm">Max people: </span>
            <span className="text-md font-semibold">
              {item?.properties?.max_people}
            </span>
          </div>
        </div>
        <div className="text-gray-500 text-sm">
          Available:{" "}
          {item?.properties?.available_from
            ? dayjs(item.properties.available_from).format("DD/MM/YYYY")
            : "Updating..."}
        </div>
        <div className="text-gray-600 text-left text-md">
          <span className="text-xl text-green-600 font-bold">
            {item?.price}
          </span>
          <span> VND/month</span>
        </div>
      </div>
    </div>
  );
};
