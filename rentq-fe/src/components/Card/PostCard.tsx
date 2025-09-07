import { useNavigate } from "react-router-dom";
import { ActivePostType } from "../../types/types";
import { FaMapMarkerAlt, FaRegHeart, FaHeart } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getAuthData } from "../../utils/helpers";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { addSavePost, deleteSavePost } from "../../store/slice/postSlice";

interface PostCardProps {
  post: ActivePostType;
  savedPosts: number[];
}

const PostCard: React.FC<PostCardProps> = ({ post, savedPosts }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  useEffect(() => {
    if (savedPosts?.includes(post?.post_id)) {
      setIsFavorite(true);
    } else {
      setIsFavorite(false);
    }
  }, [savedPosts, post?.post_id]);

  const mainImage =
    post?.properties?.property_images?.find((img) => img.is_main) ||
    post?.properties?.property_images?.[0];

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
      onClick={() => navigate(`/detailpost/${post.alias}`)}
      className="relative group bg-[#F0F2F5] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
    >
      <div className="relative">
        {mainImage ? (
          <img
            src={mainImage.image_url}
            alt={post.alias}
            className="w-full h-44 lg:h-52 object-cover rounded-t-2xl transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-44 lg:h-52 bg-gray-300 flex items-center justify-center text-gray-600 rounded-t-2xl">
            No Image
          </div>
        )}

        <div
          onClick={(e) => handleFavoriteClick(e, post.post_id)}
          className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md hover:scale-110 transition-transform duration-200"
        >
          {isFavorite ? (
            <FaHeart size={20} className="text-[#E07B39]" />
          ) : (
            <FaRegHeart size={20} className="text-gray-400" />
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-2">
        {/* Address */}
        <div className="flex items-center gap-2 text-[#0A2E50] font-semibold">
          <FaMapMarkerAlt className="text-[#E07B39]" />
          <p className="truncate">
            {post?.properties?.address.length > 50
              ? post?.properties?.address.slice(0, 40) + "..."
              : post?.properties?.address}
          </p>
        </div>

        {/* Details */}
        <div className="text-gray-600 text-sm">
          <div className="text-lg font-bold text-green-600">
            {post?.price} VND/month
          </div>
          <div className="flex gap-3  mt-2">
            <span>
              Area:{" "}
              <span className="font-semibold">{post?.properties?.area} m²</span>
            </span>
            <span>|</span>
            <span>
              Max:{" "}
              <span className="font-semibold">
                {post?.properties?.max_people} people
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
