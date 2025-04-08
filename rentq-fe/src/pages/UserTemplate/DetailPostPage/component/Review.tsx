import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store";
import { getAuthData } from "../../../../utils/helpers";
import { ReviewProperty } from "../../../../types/types";
import { createNewReview } from "../../../../store/slice/postSlice";
import { FaStar } from "react-icons/fa";
import { Pagination, Progress } from "antd";
import { toast } from "react-toastify";

const Review = () => {
  const { data, reviewData } = useSelector(
    (state: RootState) => state.postReducer
  );
  const dispatch = useDispatch<AppDispatch>();

  const [isExpanded, setIsExpanded] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const pageSize = 4;
  const [currentPage, setCurrentPage] = useState(1);

  const paginatedReviews = reviewData?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const averageRating =
    (reviewData?.reduce((sum: number, r: any) => sum + r.rating, 0) ?? 0) /
    (reviewData?.length || 1);

  const ratingNumber = reviewData?.map((item: any) => item.rating);
  const ratingCounts = ratingNumber?.reduce(
    (acc: Record<number, number>, rating: number) => {
      acc[rating] = (acc[rating] || 0) + 1;
      return acc;
    },
    {}
  );

  const handleSubmitReview = async () => {
    const { userId } = getAuthData();
    if (rating === 0) {
      toast.error("Please select a star rating before submitting your review!");
      return;
    }
    if (comment === "") {
      toast.error("Comment is required");
      return;
    }
    if (userId === data?.landlord_id) {
      toast.error("You can't review your own posts");
      return;
    }
    const newReview: ReviewProperty = {
      listing_id: data?.listing_id,
      tenant_id: userId,
      rating,
      comment,
    };
    await dispatch(createNewReview(newReview)).unwrap();
    setComment("");
    setRating(0);
  };

  return (
    <div className="my-8">
      <h2 className="text-xl font-semibold">Rating</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 ">
        <div className="flex items-center">
          <div className="flex items-center gap-2 mb-4 mr-10">
            <span className="text-5xl mt-5 font-bold">
              {averageRating.toFixed(1)}
            </span>
            <p className="text-gray-600 mt-2 text-sm">
              {reviewData?.length} reviews
            </p>
          </div>
        </div>

        <div className="space-y-2 lg:w-full sm:w-full">
          {[5, 4, 3, 2, 1].map((star, index) => (
            <div key={index} className="grid grid-cols-6 items-center">
              <div className="flex items-center col-span-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FaStar
                    key={i}
                    className={i < star ? "text-yellow-500" : "text-gray-300"}
                  />
                ))}
              </div>

              {Array.isArray(reviewData) && reviewData.length > 0 ? (
                <>
                  <Progress
                    percent={
                      ((ratingCounts?.[star] ?? 0) /
                        (reviewData?.length || 1)) *
                      100
                    }
                    showInfo={false}
                    className="ml-2 col-span-3"
                  />
                  <span className="ml-2">{ratingCounts?.[star] ?? 0}</span>
                </>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 my-6 grid lg:grid-cols-2 md:grid-cols-1 gap-x-20">
        {paginatedReviews?.map((review: any) => (
          <div key={review.review_id} className="py-2 rounded-lg">
            <div className="flex">
              <div className="mr-3 flex flex-col items-center justify-center">
                <img
                  src={review?.users?.avatar_url}
                  alt=""
                  width={40}
                  height={40}
                  className="rounded-full border border-gray-100"
                />
              </div>
              <div>
                <p className="font-bold">{review?.users?.full_name}</p>
                <p className="text-gray-500 text-xs my-1">
                  {new Date(review?.created_at).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex mt-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar
                  key={`${review.review_id}-${i}`}
                  className={
                    i < review.rating ? "text-yellow-500" : "text-gray-300"
                  }
                  size={12}
                />
              ))}
            </div>
            <p className="mt-2">
              {isExpanded
                ? review?.comment
                : review?.comment.slice(0, 97) + " ..."}
            </p>
            {review?.comment.length > 100 && (
              <div>
                <button
                  className="mt-2 cursor-pointer text-sm underline"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? "View less" : "View more"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-end">
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={reviewData?.length || 0}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>

      <div className="mt-10 mx-1">
        <h3 className="font-bold text-lg text-gray-800 mb-3">
          Add your review
        </h3>

        {/* Star Rating */}
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <FaStar
              key={i}
              className={`cursor-pointer transition-all duration-300 ${
                i < rating
                  ? "text-yellow-500"
                  : "text-gray-300 hover:text-yellow-400"
              }`}
              size={18}
              onClick={() => setRating(i + 1)}
            />
          ))}
        </div>

        {/* Textarea */}
        <textarea
          className="mt-4 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
          rows={4}
          name="ratingText"
          placeholder="Write your comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>

        {/* Submit Button */}
        <button
          className="mt-4 w-full bg-[#483507] text-white p-3 rounded-lg hover:bg-[#c2bdb5] hover:text-[#483507] hover:font-bold hover:cursor-pointer"
          onClick={handleSubmitReview}
        >
          Submit Review
        </button>
      </div>
    </div>
  );
};

export default Review;
