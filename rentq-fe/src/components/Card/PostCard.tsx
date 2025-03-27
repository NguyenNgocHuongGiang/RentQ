import { useNavigate } from "react-router-dom";
import { ListingsProperty } from "../../types/types";

interface PostCardProps {
  listing: ListingsProperty;
}

const PostCard: React.FC<PostCardProps> = ({ listing }) => {
  const navigate = useNavigate()
  const mainImage =
    listing.listing_images?.find((img) => img.is_main) || listing.listing_images?.[0];

  return (
    <div onClick={() => navigate(`/detailpost/${listing.listing_id}`)} className="bg-white shadow-lg rounded-lg overflow-hidden p-4 hover:cursor-pointer">
      {mainImage ? (
        <img
          src={mainImage.image_url}
          alt={listing.title}
          className="w-full h-40 object-cover rounded-md mb-4"
        />
      ) : (
        <div className="w-full h-40 bg-gray-300 flex items-center justify-center text-gray-600">
          No Image
        </div>
      )}
      <h3 className="text-xl font-semibold mb-2">{listing.title}</h3>
      <p className="text-gray-600">{listing.description}</p>
    </div>
  );
};

export default PostCard;
