import { useNavigate } from "react-router-dom";
import { ActivePostType } from "../../types/types";
import { Bookmark } from "lucide-react";
import { FaMapMarkerAlt } from "react-icons/fa";

interface PostCardProps {
  listing: ActivePostType;
}

const PostCard: React.FC<PostCardProps> = ({ listing }) => {
  const navigate = useNavigate();
  // const mainImage =
  //   listing.listing_images?.find((img) => img.is_main) ||
  //   listing.listing_images?.[0];

  // console.log(listing);

  return (
    <div
      onClick={() => navigate(`/detailpost/${listing.alias}`)}
      className="hover:scale-108 transition-transform duration-200 bg-white shadow-lg rounded-lg overflow-hidden p-4 hover:cursor-pointer"
    >
      {/* {mainImage ? (
        <img
          src={mainImage.image_url}
          alt={listing.title}
          className="w-full h-30 lg:h-40 object-cover rounded-md mb-4"
        />
      ) : (
        <div className="w-full h-30 lg:h-40 bg-gray-300 flex items-center justify-center text-gray-600">
          No Image
        </div>
      )} */}
       <div className="w-full h-30 lg:h-40 bg-gray-300 flex items-center justify-center text-gray-600">
          No Image
        </div>
      <div className="text-md text-left font-semibold mb-2 flex items-center">
        <FaMapMarkerAlt className="mr-2 text-red-500 text-md" />
        <p>{listing?.properties.address}</p>
      </div>
      <div className="flex justify-between">
        <div>
          <div className="text-gray-600 text-left text-md">
            <span className="text-xl text-green-600 font-bold">
              {listing.price}
            </span>
            <span> VND/month</span>
          </div>
          <div className="flex mt-2 space-x-1 text-yellow-500">
            <span>⭐</span>
            <span>⭐</span>
            <span>⭐</span>
            <span>⭐</span>
            <span>⭐</span>
          </div>
        </div>
        <Bookmark size={24} />
      </div>
    </div>
  );
};

export default PostCard;
