import { useEffect, useState } from "react";
import { getInfoUser } from "../../../../store/slice/userSlice";
import { getAuthData } from "../../../../utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store";
import { Modal, Button } from "antd";
import AddRoomFinderModal from "../../../../components/Modal/AddRoomFinderModal";

const MyProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: user } = useSelector((state: RootState) => state.userReducer);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAddRoomFinder, setShowAddRoomFinder] = useState(false);

  useEffect(() => {
    fetchInfo();
  }, []);

  const fetchInfo = async () => {
    const userData = getAuthData();
    if (userData?.userId) {
      dispatch(getInfoUser(userData.userId)).unwrap();
    }
  };
  const handleOpen = () => setIsModalOpen(true);
  const handleClose = () => setIsModalOpen(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px]">
      <img
        src={user?.avatar_url}
        alt="Avatar"
        className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
      />
      <h2 className="mt-4 text-xl font-semibold text-gray-800">
        {user?.full_name}
      </h2>
      <div className="mt-6 w-full max-w-xl px-4">
        <button
          onClick={handleOpen}
          className="flex gap-2 items-center cursor-pointer ml-4 bg-gray-100 text-gray-500 text-left px-4 py-2 rounded-full w-full hover:bg-gray-200"
        >
          <img src={user?.avatar_url} alt="" className="w-8 h-8 rounded-full" />
          <span>Bạn muốn đăng bài viết hả, {user?.full_name}?</span>
        </button>
      </div>

      <Modal
        title= <p className="pt-9 pl-10">Nhu cầu hiện tại của bạn?</p>
        open={isModalOpen}
        onCancel={handleClose}
        footer={null}
        centered
      >
        <div className="flex flex-col gap-3 px-10 py-2">
          <Button
            className="!bg-blue-100 !text-blue-800 !hover:bg-blue-200"
            onClick={() => {
              console.log("Tôi đã có trọ");
              handleClose();
            }}
          >
            Tôi đã có trọ và muón tìm người ở ghép
          </Button>

          <Button
            className="!bg-green-100 !text-green-800 !hover:bg-green-200"
            onClick={() => {
              setShowAddRoomFinder(true);
              handleClose();
            }}
          >
            Tôi đang tìm trọ
          </Button>

          <Button
            type="text"
            onClick={handleClose}
            className="text-gray-400 hover:underline"
          >
            Huỷ
          </Button>
        </div>
      </Modal>

      <AddRoomFinderModal open={showAddRoomFinder} onClose={() => setShowAddRoomFinder(false)} />
    </div>
  );
};

export default MyProfile;
