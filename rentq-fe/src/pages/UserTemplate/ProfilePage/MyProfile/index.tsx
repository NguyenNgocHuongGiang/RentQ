import { useEffect, useState } from "react";
import { getInfoUser } from "../../../../store/slice/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store";
import { Pagination, Select } from "antd";
import { PostCardProfile } from "../../../../components/Card/PostCardProfile";
import { FaHome, FaUser, FaEdit, FaCamera } from "react-icons/fa";
import { getUserPostProfile } from "../../../../store/slice/roomFinderSlice";
import { RoomFinderCard } from "../../../../components/Card/RoomFinderCard";
import { useNavigate, useParams } from "react-router-dom";
import { createMessage } from "../../../../store/slice/messageSlice";
import { getAuthData } from "../../../../utils/helpers";
import { toast } from "react-toastify";
import { RightContentProfile } from "./component/RightContentProfile";
import { LeftContentProfile } from "./component/LeftContentProfile";
import { PopularHostsSidebar } from "./component/PopularHostsSidebar";
import { RoommateRequestCard } from "../../../../components/Card/RoommateRequestCard";

const { Option } = Select;


const MyProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: user } = useSelector((state: RootState) => state.userReducer);
  const { listPostProfile } = useSelector((state: RootState) => state.roomFinderReducer);
  const [filteredPosts, setFilteredPosts] = useState<any[]>(listPostProfile ?? []);

  // phan trang
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = (filteredPosts ?? []).slice(indexOfFirstPost, indexOfLastPost);
  const { userId } = useParams();
  const navigate = useNavigate();

  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [filterType, setFilterType] = useState<string>("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mockPopularHosts = [
    { id: 1, name: "Nguyễn Văn A", totalPosts: 12 },
    { id: 2, name: "Trần Thị B", totalPosts: 8 },
    { id: 3, name: "Lê Văn C", totalPosts: 6 },
  ];


  useEffect(() => {
    let result = listPostProfile ? [...listPostProfile] : [];

    if (filterType !== "all") {
      result = result.filter((item: any) => item.label === filterType);
    }

    const sorted = [...result].sort((a, b) => {
      const dateA = new Date(a.created_at).getTime();
      const dateB = new Date(b.created_at).getTime();
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

    setFilteredPosts(sorted);
  }, [listPostProfile, filterType, sortOrder]);

  useEffect(() => {
    fetchInfo();
  }, [userId]);

  useEffect(() => {
    setCurrentPage(1);
    setFilteredPosts(listPostProfile ?? []);
  }, [listPostProfile]);

  const fetchInfo = async () => {
    if (userId) {
      dispatch(getInfoUser(+userId)).unwrap();
      dispatch(getUserPostProfile(+userId)).unwrap();
    }
  };

  const handleMessage = () => {
    const isLoggedIn = !!localStorage.getItem("authInfo");
    const hostInfo = {
      id: user?.user_id,
      full_name: user?.full_name,
      avatar_url: user?.avatar_url,
    };

    if (isLoggedIn) {
      const newMessage = {
        sender_id: getAuthData()?.userId,
        receiver_id: user?.user_id,
        receiver_full_name: user?.full_name,
        receiver_avatar_url: user?.avatar_url,
        content: "Hello! Can I have contact with you?",
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header Section */}
        <div className="mb-8">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
            {/* Cover Background */}
            <div className="h-32 bg-gradient-to-r from-[#0A2E50] via-[#1a4c7a] to-[#5B7295FF] relative">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute top-4 right-4">
                <button className="bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-all duration-300">
                  <FaEdit size={14} />
                </button>
              </div>
            </div>

            {/* Profile Info */}
            <div className="relative px-8 pb-8">
              {/* Avatar */}
              <div className="relative -mt-16 mb-6">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-200">
                  {user?.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
                      <FaUser className="text-gray-400 text-4xl" />
                    </div>
                  )}
                </div>
                <button className="absolute bottom-2 right-2 w-8 h-8 bg-[#E07B39] rounded-full flex items-center justify-center text-white shadow-lg hover:bg-[#d96a2c] transition-all duration-300 hover:scale-110">
                  <FaCamera size={12} />
                </button>
              </div>

              {/* User Info */}
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {user?.full_name || "Tên người dùng"}
                  </h1>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <FaHome size={12} />
                      {(listPostProfile?.length ?? 0)} bài đăng
                    </span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <span>Thành viên từ {new Date(user?.created_at).getFullYear()}</span>
                  </div>
                </div>
                {getAuthData()?.userId !== user?.user_id ? (
                  <button className="cursor-pointer px-6 py-2 bg-gradient-to-r from-[#E07B39] to-[#ff8c42] text-white rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all duration-300" onClick={handleMessage}>
                    Nhắn tin
                  </button>
                ) : <button className="cursor-pointer px-6 py-2 bg-gradient-to-r from-[#E07B39] to-[#ff8c42] text-white rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all duration-300" onClick={() => navigate('/me/user-information')}>
                    Chỉnh sửa thông tin cá nhân
                  </button>}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {
              getAuthData()?.userId === user?.user_id ? <LeftContentProfile
                isModalOpen={isModalOpen}
                setIsModalOpen={setIsModalOpen}
              /> : <PopularHostsSidebar hosts={mockPopularHosts} />
            }
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Content Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Bài viết của {getAuthData()?.userId === user?.user_id ? 'tôi' : user?.full_name.length > 5 ? `${user?.full_name.slice(0, 5)}...` : user?.full_name}</h2>
                <p className="text-gray-600 mt-1">Quản lý tất cả bài đăng</p>
              </div>
              <div className="flex items-center gap-4">
                <Select
                  defaultValue="newest"
                  onChange={(value) => setSortOrder(value as "newest" | "oldest")}
                  className="min-w-[150px]"
                  size="middle"
                >
                  <Option value="newest">Mới nhất</Option>
                  <Option value="oldest">Cũ nhất</Option>
                </Select>

                <Select
                  defaultValue="all"
                  onChange={(value) => setFilterType(value)}
                  className="min-w-[180px] ml-2"
                  size="middle"
                >
                  <Option value="all">Tất cả</Option>
                  <Option value="post">Bài đăng cho thuê</Option>
                  <Option value="room_finder">Bài đăng tìm trọ</Option>
                  <Option value="roommate-requests">Bài đăng tìm người ở ghép</Option>
                </Select>
              </div>
            </div>

            {/* Posts Grid */}
            <div className="space-y-6">
              {(filteredPosts?.length ?? 0) > 0 ? (
                <>
                  {currentPosts.map((post: any) => {
                    if (post.label === "post") {
                      return <PostCardProfile key={post.unique_id} item={post} />;
                    } else if (post.label === "room_finder") {
                      return <RoomFinderCard key={post.unique_id} item={post} />;
                    } else if (post.label === "roommate-requests") {
                      return <RoommateRequestCard key={post.unique_id} item={post} />;
                    }
                    return null;
                  })}
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <FaHome className="text-gray-400 text-3xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">Chưa có bài viết nào</h3>
                  <p className="text-gray-500 mb-6 max-w-md mx-auto">
                    Bắt đầu chia sẻ nhu cầu của bạn để kết nối với cộng đồng
                  </p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-8 py-3 bg-gradient-to-r from-[#E07B39] to-[#ff8c42] text-white rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    Tạo bài viết đầu tiên
                  </button>
                </div>
              )}
            </div>

            {/* Pagination */}
            {(filteredPosts?.length ?? 0) > postsPerPage && (
              <div className="flex justify-center mt-8">
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-2">
                  <Pagination
                    current={currentPage}
                    pageSize={postsPerPage}
                    total={filteredPosts?.length}
                    onChange={(page) => setCurrentPage(page)}
                    showSizeChanger={false}
                    className="!m-0"
                  />
                </div>
              </div>
            )}
          </div>

          {/* RightSide  */}
          <div className="lg:col-span-1">
            <RightContentProfile />
          </div>
        </div>
      </div>
    </div >
  );
};

export default MyProfile;