import { Modal, Form, Input, Button, message, Select } from "antd";
import { useEffect, useState } from "react";
import { getAuthData } from "../../utils/helpers";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { getTenantProperties } from "../../store/slice/propertySlice";
import { PropertyType, RoommateRequestType } from "../../types/types";
import { createRoommateRequest } from "../../store/slice/roomFinderSlice";
import { toast } from "react-toastify";

const { Option } = Select;

interface AddRoomFinderModalProps {
  open: boolean;
  onClose: () => void;
}

export const AddRoomRequestModal: React.FC<AddRoomFinderModalProps> = ({
  open,
  onClose,
}) => {
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [listTenantsProperties, setListTenantsProperties] = useState<PropertyType[]>([]);

  useEffect(() => {
    const fetchProperties = async () => {
      await dispatch(getTenantProperties(getAuthData()?.userId))
        .unwrap()
        .then((res) => setListTenantsProperties(res));
    };
    fetchProperties();
  }, [dispatch]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const payload : RoommateRequestType = {
        tenant_id: getAuthData()?.userId,
        property_id: values.property_id ?? null,
        description: values.description,
        status: "open",
      };

      await dispatch(createRoommateRequest(payload)).unwrap();
      toast.success("Tạo yêu cầu thành công!");
      form.resetFields();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Tạo yêu cầu thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      className="rounded-2xl overflow-hidden"
    >
      <Form
        form={form}
        layout="vertical"
        className="space-y-4 mt-2"
      >
        {/* Chọn property */}
        <Form.Item
          name="property_id"
          label={<span className="font-medium text-gray-700">Chọn trọ hoặc nhà đã thuê</span>}
          rules={[{ required: true, message: "Vui lòng chọn trọ hoặc nhà đã thuê!" }]}
        >
          <Select
            placeholder="Chọn trọ hoặc nhà đã thuê"
            className="rounded-lg"
          >
            {listTenantsProperties.map((property) => (
              <Option key={property.property_id} value={property.property_id}>
                {property.address}
              </Option>
            ))}
          </Select>
        </Form.Item>

        {/* Nhập mô tả */}
        <Form.Item
          name="description"
          label={<span className="font-medium text-gray-700">Mô tả yêu cầu</span>}
          rules={[{ required: true, message: "Vui lòng nhập mô tả yêu cầu!" }]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Nhập mô tả yêu cầu..."
            className="rounded-lg"
          />
        </Form.Item>

        {/* Footer nút bấm */}
        <div className="flex justify-end gap-3 pt-2">
          <Button
            onClick={onClose}
            className="rounded-lg"
          >
            Hủy
          </Button>
          <Button
            type="primary"
            onClick={handleOk}
            loading={loading}
            className="bg-gradient-to-r from-[#E07B39] to-[#ff8c42] border-none rounded-lg shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300"
          >
            Tạo yêu cầu
          </Button>
        </div>
      </Form>
    </Modal>
  );
};
