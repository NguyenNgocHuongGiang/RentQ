import React, { useState } from "react";
import { FaDollarSign, FaCalendarAlt, FaUsers, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { PostsType, RoomFinderType } from "../../types/types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { getListPostMatched } from "../../store/slice/roomFinderSlice";
import { Modal, Progress } from "antd";
import { PostCardProfile } from "./PostCardProfile";

interface RoomFinderCardProps {
  item: RoomFinderType;
}

export const RoomFinderCard: React.FC<RoomFinderCardProps> = ({ item }) => {
  const dispatch = useDispatch<AppDispatch>()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [matchedPosts, setMatchedPosts] = useState<PostsType[]>([]);
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return {
          text: "Đang tìm",
          bgColor: "bg-green-100",
          textColor: "text-green-700",
          dotColor: "bg-green-500",
        };
      case "matched":
        return {
          text: "Đã ghép",
          bgColor: "bg-blue-100",
          textColor: "text-blue-700",
          dotColor: "bg-blue-500",
        };
      case "closed":
        return {
          text: "Đã đóng",
          bgColor: "bg-gray-100",
          textColor: "text-gray-700",
          dotColor: "bg-gray-500",
        };
      default:
        return {
          text: "Không xác định",
          bgColor: "bg-gray-100",
          textColor: "text-gray-700",
          dotColor: "bg-gray-500",
        };
    }
  };

  const statusConfig = getStatusConfig(item.status);

  const formatPreferences = (preferences: string) => {
    return preferences
      .split(";")
      .map((pref, idx) => (
        <p key={idx} className="text-[#E07B39] font-semibold text-sm">
          {pref.trim()}
        </p>
      ));
  };

  const handleFindMatch = () => {
    if (item.finder_id) {
      dispatch(getListPostMatched({ finder_id: item?.finder_id, topN: 4 })).unwrap()
        .then((listPostMatched) => {
          if (listPostMatched && listPostMatched.length > 0) {
            setMatchedPosts(listPostMatched); 
            setIsModalOpen(true); 
          } else {
            console.log("Không có bài post nào phù hợp");
          }
        })
        .catch((error) => {
          console.log(error);
        })
    }
  }


  return (
    <>
      <div onClick={handleFindMatch} className="group relative rounded-2xl overflow-hidden shadow-lg bg-white mb-6 cursor-pointer transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] border border-gray-100">
        {/* Status Badge */}
        <div className="absolute top-4 right-4 z-10">
          <div className={`${statusConfig.bgColor} ${statusConfig.textColor} px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2 shadow-sm`}>
            <div className={`w-2 h-2 ${statusConfig.dotColor} rounded-full animate-pulse`}></div>
            {statusConfig.text}
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 pt-12">
          {/* Location */}
          <div className="flex items-start gap-3 mb-6">
            <div className="flex-shrink-0 mt-1 p-3 bg-gradient-to-r from-[#E07B39]/10 to-[#ff8c42]/10 rounded-full">
              <FaMapMarkerAlt className="text-[#E07B39] text-lg" />
            </div>
            <div className="flex-grow">
              <p className="text-gray-500 text-sm mt-1">Khu vực mong muốn</p>
              <h3 className="font-bold text-xl text-gray-800 leading-tight group-hover:text-[#E07B39] transition-colors duration-300">
                {item.preferred_location || "Khu vực chưa có"}
              </h3>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {/* Budget */}
            {item.budget && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-500 rounded-lg">
                    <FaDollarSign className="text-white text-sm" />
                  </div>
                  <div>
                    <p className="text-green-600 text-xs">Ngân sách</p>
                    <p className="text-green-700 font-bold text-md">
                      {item.budget.toLocaleString()} VND
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Move in Date */}
            {item.move_in_date && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500 rounded-lg">
                    <FaCalendarAlt className="text-white text-sm" />
                  </div>
                  <div>
                    <p className="text-purple-600 text-xs">Ngày dọn vào</p>

                    <p className="text-purple-700 font-bold text-sm">
                      {new Date(item.move_in_date).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Preferences */}
          {item.preferences && (
            <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl border border-orange-100 mb-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 p-2 bg-[#E07B39] rounded-lg">
                  <FaUsers className="text-white text-sm" />
                </div>
                <div className="flex-grow">
                  <p className="text-gray-700 text-sm font-medium mb-1">Yêu cầu thêm:</p>
                  <div className="text-[#E07B39] font-semibold text-sm">
                    {formatPreferences(item.preferences)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <FaClock className="text-xs" />
              <span>
                {item.created_at
                  ? `Đăng ${new Date(item.created_at).toLocaleDateString('vi-VN')}`
                  : "Ngày đăng không xác định"
                }
              </span>
            </div>
          </div>
        </div>

        {/* Hover Border Effect */}
        <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#E07B39]/20 rounded-2xl transition-all duration-300 pointer-events-none" />

      </div>

      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        title="Danh sách bài viết phù hợp"
        width={800}
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {matchedPosts.map((post: any) => (
            <div key={post.post_id} className="bg-gray-100 rounded-xl p-4 shadow-sm">
              {/* Card nội dung */}
              <PostCardProfile item={post} />

              {/* Thanh hiển thị % match */}
              {post.matchScore !== undefined && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    Mức độ phù hợp: {post.matchScore}%
                  </p>
                  <Progress
                    percent={post.matchScore}
                    status="active"
                    strokeColor={{
                      from: "#E07B39",
                      to: "#ff8c42",
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </Modal>


    </>
  );
};