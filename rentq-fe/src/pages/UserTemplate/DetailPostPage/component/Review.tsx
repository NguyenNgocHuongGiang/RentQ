import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store";
import { getAuthData } from "../../../../utils/helpers";
import { ReviewProperty } from "../../../../types/types";
import {
  createNewReview,
  deleteReview,
  updateReview,
} from "../../../../store/slice/postSlice";
import { FaStar } from "react-icons/fa";
import { Dropdown, Pagination, Progress, Space } from "antd";
import type { MenuProps } from "antd";
import { toast } from "react-toastify";
import { HiOutlineDotsVertical } from "react-icons/hi";

const Review = () => {
  const getDropdownItems = (review: any): MenuProps["items"] => [
    {
      key: "1",
      label: "Edit review",
      onClick: () => handleEditReview(review),
    },
    {
      key: "2",
      label: "Delete review",
      onClick: () => handleDeleteReview(review.review_id),
    },
  ];

  const { detailPost, reviewData } = useSelector(
    (state: RootState) => state.postReducer
  );
  const dispatch = useDispatch<AppDispatch>();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const pageSize = 4;
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedReviews, setExpandedReviews] = useState<string[]>([]);
  const [reviewIdBeingEdited, setReviewIdBeingEdited] = useState<string | null>(
    null
  );

  const authUser = getAuthData();
  const paginatedReviews = reviewData?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const averageRating =
    (reviewData?.reduce((sum: number, r: any) => sum + r.rating, 0) ?? 0) /
    (reviewData?.length || 1);

  const ratingCounts = reviewData?.reduce(
    (acc: Record<number, number>, r: any) => {
      acc[r.rating] = (acc[r.rating] || 0) + 1;
      return acc;
    },
    {} as Record<number, number>
  );

  const handleSubmitReview = async () => {
    const { userId } = authUser;
    if (rating === 0) {
      toast.error("Please select a star rating before submitting your review!");
      return;
    }
    if (comment === "") {
      toast.error("Comment is required");
      return;
    }
    if (userId === detailPost?.properties?.landlord_id) {
      toast.error("You can't review your own posts");
      return;
    }
    const newReview: ReviewProperty = {
      property_id: detailPost?.properties?.property_id,
      tenant_id: userId,
      rating,
      comment,
    };

    if (reviewIdBeingEdited) {
      // Edit
      await dispatch(
        updateReview({ review_id: +reviewIdBeingEdited, ...newReview })
      ).unwrap();
      toast.success("Review updated successfully");
    } else {
      // Create
      await dispatch(createNewReview(newReview)).unwrap();
      toast.success("Review created successfully");
    }
    setComment("");
    setRating(0);
  };

  const toggleExpanded = (reviewId: string) => {
    setExpandedReviews((prev) =>
      prev.includes(reviewId)
        ? prev.filter((id) => id !== reviewId)
        : [...prev, reviewId]
    );
  };

  const handleDeleteReview = (reviewId: string) => {
    dispatch(deleteReview(+reviewId)).unwrap();
    toast.info("You clicked delete for review: " + reviewId);
  };

  const handleEditReview = (review: any) => {
    setRating(review.rating);
    setComment(review.comment);
    setReviewIdBeingEdited(review?.review_id);
  };

  return (
    <div className="my-8">
      <h2 className="text-xl font-semibold">Rating</h2>

      {reviewData?.length > 0 ? (
        <>
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
              {[5, 4, 3, 2, 1].map((star, index) => {
                const percent =
                  reviewData?.length > 0
                    ? ((ratingCounts?.[star] ?? 0) / reviewData.length) * 100
                    : 0;

                return (
                  <div key={index} className="grid grid-cols-6 items-center">
                    <div className="flex items-center col-span-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar
                          key={i}
                          className={
                            i < star ? "text-yellow-500" : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <Progress
                      percent={percent}
                      showInfo={false}
                      className="ml-2 col-span-3"
                      strokeColor={percent === 0 ? "#d1d5db" : undefined}
                    />
                    <span className="ml-2">{ratingCounts?.[star] ?? 0}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-4 my-6 grid lg:grid-cols-2 md:grid-cols-1 gap-x-20">
            {paginatedReviews?.map((review: any) => {
              const isOwnComment = review?.users?.user_id === authUser.userId;
              const isExpanded = expandedReviews.includes(review.review_id);
              const shortComment =
                review?.comment.length > 97
                  ? review?.comment.slice(0, 97) + " ..."
                  : review?.comment;

              return (
                <div key={review.review_id} className="py-2 rounded-lg">
                  <div className="flex justify-between items-center">
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
                    {isOwnComment && (
                      <div className="mt-2 flex gap-3 text-sm">
                        <Dropdown menu={{ items: getDropdownItems(review) }}>
                          <a onClick={(e) => e.preventDefault()}>
                            <Space>
                              <HiOutlineDotsVertical
                                size={18}
                                className="cursor-pointer"
                              />
                            </Space>
                          </a>
                        </Dropdown>
                      </div>
                    )}
                  </div>

                  <div className="flex mt-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar
                        key={`${review.review_id}-${i}`}
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
                    {isExpanded ? review.comment : shortComment}
                  </p>

                  {review?.comment.length > 100 && (
                    <button
                      className="mt-2 cursor-pointer text-sm underline"
                      onClick={() => toggleExpanded(review.review_id)}
                    >
                      {isExpanded ? "View less" : "View more"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-2 flex justify-end">
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={reviewData?.length || 0}
              onChange={(page) => setCurrentPage(page)}
            />
          </div>
        </>
      ) : (
        <p className="text-gray-500 italic mt-5 text-center">Hãy là người đầu tiên review</p>
      )}

      <div className="mt-10 mx-1">
        <h3 className="font-bold text-lg text-gray-800 mb-3">
          Add your review
        </h3>
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
        <textarea
          className="mt-4 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-300"
          rows={4}
          name="ratingText"
          placeholder="Write your comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
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
