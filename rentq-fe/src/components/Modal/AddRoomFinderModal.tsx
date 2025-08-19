// AddRoomFinderModal.tsx
import { Modal } from "antd";

const AddRoomFinderModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  return (
    <Modal
      title="Tạo bài tìm trọ"
      open={open}
      onCancel={onClose}
      footer={null}
      centered
    >
      {/* Nội dung form ở đây */}
      <p>Form nhập thông tin tìm trọ nè... chua tro chua nguoi o</p>
    </Modal>
  );
};

export default AddRoomFinderModal;
