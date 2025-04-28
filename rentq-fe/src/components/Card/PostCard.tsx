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
      className="hover:scale-105 transition-transform duration-200 bg-white shadow-lg rounded-lg overflow-hidden p-4 hover:cursor-pointer"
    >
      <div className="relative">
        {mainImage ? (
          <img
            src={mainImage.image_url}
            alt={post.alias}
            className="w-full h-30 lg:h-40 object-cover rounded-md mb-4"
          />
        ) : (
          <div className="w-full h-30 lg:h-40 bg-gray-300 flex items-center justify-center text-gray-600 rounded-md mb-4">
            No Image
          </div>
        )}

        <div
          onClick={(e) => handleFavoriteClick(e, post.post_id)}
          className="absolute top-2 right-2 bg-white rounded-full p-2 shadow cursor-pointer"
        >
          {isFavorite ? (
            <FaHeart size={20} className="text-red-500" />
          ) : (
            <FaRegHeart size={20} className="text-red-500" />
          )}
        </div>
      </div>

      <div className="text-md text-left font-semibold mb-2 flex items-center">
        <FaMapMarkerAlt className="mr-2 text-red-500 text-md" />
        <p className="flex-3/5">
          {post?.properties?.address.length > 50
            ? post?.properties?.address.slice(0, 30) + "..."
            : post?.properties?.address}
        </p>
      </div>

      <div className="flex justify-between">
        <div>
          <div className="flex flex-row space-x-2 text-gray-500 text-sm mb-2">
            <div>
              <span className="text-gray-500 text-sm">Area: </span>
              <span className="text-md font-semibold">
                {post?.properties?.area} m²
              </span>
            </div>
            <div>|</div>
            <div>
              <span className="text-gray-500 text-sm">Max people: </span>
              <span className="text-md font-semibold">
                {post?.properties?.max_people}
              </span>
            </div>
          </div>
          <div className="text-gray-600 text-left text-md">
            <span className="text-xl text-green-600 font-bold">
              {post?.price}
            </span>
            <span> VND/month</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
