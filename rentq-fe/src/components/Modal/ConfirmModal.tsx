import React from 'react';
import { Modal } from 'antd';

interface ConfirmModalProps {
  open: boolean;
  title?: string;
  content?: string;
  onOk: () => void;
  onCancel: () => void;
  okText?: string;
  cancelText?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  open,
  title = "Delete Confirmation",
  content = "Are you sure you want to delete this item?",
  onOk,
  onCancel,
  okText = "Delete",
  cancelText = "Cancel"
}) => {
  return (
    <Modal
      title={title}
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okText={okText}
      cancelText={cancelText}
    >
      <p>{content}</p>
    </Modal>
  );
};

export default ConfirmModal;
