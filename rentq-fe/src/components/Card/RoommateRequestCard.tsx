import { Card, Tag, Tooltip, Typography, Divider, Dropdown, Menu } from "antd";
import {
    CalendarOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
    MoreOutlined,
} from "@ant-design/icons";
import { RoommateRequestType } from "../../types/types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { FaMapMarkerAlt } from "react-icons/fa";
import { getAuthData } from "../../utils/helpers";
import { useNavigate } from "react-router-dom";
import { createMessage } from "../../store/slice/messageSlice";
import { toast } from "react-toastify";

const { Title } = Typography;

interface RoommateRequestCardProps {
    item: RoommateRequestType;
}

export const RoommateRequestCard: React.FC<RoommateRequestCardProps> = ({
    item,
}) => {
    // const { data: user } = useSelector((state: RootState) => state.userReducer);
    const mainImage =
        item?.properties?.property_images?.find((img: { is_main: boolean }) => img.is_main) ||
        item?.properties?.property_images?.[0];

    const utilitiesList = item?.properties?.utilities.split(";");
    const navigate = useNavigate()
    const dispatch = useDispatch<AppDispatch>()

    const getStatusTag = (status: RoommateRequestType["status"]) => {
        switch (status) {
            case "open":
                return (
                    <Tag
                        color="success"
                        icon={<CheckCircleOutlined />}
                        className="rounded-full text-xs font-medium px-2 py-1"
                    >
                        Đang tìm
                    </Tag>
                );
            case "closed":
                return (
                    <Tag
                        color="error"
                        icon={<CloseCircleOutlined />}
                        className="rounded-full text-xs font-medium px-2 py-1"
                    >
                        Đã đóng
                    </Tag>
                );
            default:
                return (
                    <Tag className="rounded-full text-xs font-medium px-2 py-1">
                        Không rõ
                    </Tag>
                );
        }
    };

const handleMessage = () => {
  const isLoggedIn = !!localStorage.getItem("authInfo");

  const receiverId = item.users?.user_id;
  if (!receiverId) {
    toast.error("Người nhận không tồn tại!");
    return;
  }

  const hostInfo = {
    id: receiverId,
    full_name: item.users?.full_name || "",
    avatar_url: item.users?.avatar_url || "",
  };

  if (isLoggedIn) {
    const newMessage = {
      sender_id: getAuthData()?.userId!,
      receiver_id: receiverId,
      receiver_full_name: item.users?.full_name || "",
      receiver_avatar_url: item.users?.avatar_url || "",
      content: `Hello! I saw your post about finding a roommate in ${item?.properties?.address}. Could you please share more details?`
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


    const handleEdit = () => {

    }

    const handleDelete = () => {

    
    }
    

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    return (
        <Card className="group relative !rounded-2xl overflow-hidden shadow-lg bg-white !mb-6 cursor-pointer transform transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02] border border-gray-100">
            {/* Header */}
            <div className="mb-5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div onClick={() => navigate(`/me/${item.users?.user_id}`)} className="mr-3 flex flex-col items-center justify-center">
                        <img
                            src={item.users?.avatar_url}
                            alt=""
                            width={40}
                            height={40}
                            className="rounded-full border border-gray-100"
                        />
                    </div>
                    <div>
                        <Title level={4} className="!m-0 !text-lg font-semibold">
                            Tìm roommate
                        </Title>
                        <div className="mt-1">{getStatusTag(item.status)}</div>
                    </div>
                </div>

                {
                    getAuthData().userId !== item.users?.user_id ? (
                        <button className="cursor-pointer px-6 py-2 bg-gradient-to-r from-[#E07B39] to-[#ff8c42] text-white rounded-full font-medium hover:shadow-lg hover:scale-105 transition-all duration-300" onClick={handleMessage}>
                            Liên hệ
                        </button>
                    ) : (<Dropdown
                        overlay={
                            <Menu>
                                <Menu.Item key="edit" onClick={handleEdit}>
                                    Sửa bài viết
                                </Menu.Item>
                                <Menu.Item key="delete" danger onClick={handleDelete}>
                                    Xóa bài viết
                                </Menu.Item>
                            </Menu>
                        }
                        trigger={["click"]}
                        placement="bottomRight"
                    >
                        <MoreOutlined className="text-xl cursor-pointer hover:text-gray-600" />
                    </Dropdown>)
                }
            </div>

            <Divider className="!my-4" />

            {/* Description */}
            <div className="py-3 px-2 mb-4 flex gap-3">
                {/* <div className="flex-1"> */}
                {/* <p className="text-xs text-gray-500 mb-2">Mô tả yêu cầu</p> */}
                <p className="text-md leading-relaxed">
                    {item.description || "Chưa có mô tả chi tiết."}
                </p>
                {/* </div> */}
            </div>

            {/* Property Information */}
            {item.properties && (
                <div onClick={() => navigate(`/detailpost/${item.properties.posts[0]?.alias}`)} className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-4 flex items-start gap-3">
                    <div className="flex-1/4 relative overflow-hidden">
                        {mainImage ? (
                            <>
                                <img
                                    src={mainImage.image_url}
                                    alt="post"
                                    className="w-full h-25 object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-110"
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

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

                    <div className="flex-3/4 space-y-2">
                        <p className="text-xs text-gray-500 mb-2">Địa chỉ</p>
                        <p className="text-sm font-medium line-clamp-1">{item.properties.address}</p>
                        <div className="flex flex-wrap gap-2">
                            {utilitiesList && utilitiesList.length > 0 && (
                                (utilitiesList.length > 7 ? utilitiesList.slice(0, 7) : utilitiesList).map(
                                    (utility: string, index: number) => (
                                        <Tag
                                            key={index}
                                            color="#DF915DFF"
                                            className="flex items-center gap-1 px-3 py-1 rounded-full text-sm"
                                        >
                                            {utility}
                                        </Tag>
                                    )
                                )
                            )}
                        </div>
                    </div>
                </div>
            )}

            <Divider className="!my-4" />

            {/* Footer */}
            <div className="flex justify-between items-center">
                {item.created_at && (
                    <Tooltip title="Ngày đăng">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                            <CalendarOutlined className="text-gray-400 text-sm" />
                            <span>{formatDate(item.created_at)}</span>
                        </div>
                    </Tooltip>
                )}
            </div>

            <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#E07B39]/20 rounded-2xl transition-all duration-300 pointer-events-none" />

        </Card>
    );
};
