import { Modal, Form, Input, InputNumber, DatePicker, Button, Checkbox } from "antd";
import dayjs from "dayjs";
import { useState } from "react";
import { FaMapMarkerAlt, FaCalendarAlt, FaDollarSign, FaUsers, FaCog } from "react-icons/fa";
import { getAuthData } from "../../utils/helpers";
import { AppDispatch } from "../../store";
import { useDispatch } from "react-redux";
import { createNewPostFindRoom } from "../../store/slice/roomFinderSlice";

const { TextArea } = Input;

interface AddRoomFinderModalProps {
  open: boolean;
  onClose: () => void;
}

const AddRoomFinderModal: React.FC<AddRoomFinderModalProps> = ({ open, onClose }) => {
  const [form] = Form.useForm();
  const [roommateSelected, setRoommateSelected] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleFinish = (values: any) => {
    let preferences: string[] = values.preferences || [];

    if (roommateSelected && values.roommate_count) {
      preferences = preferences
        .filter((p) => p !== "Ở chung với người khác")
        .concat(`Ở chung với ${values.roommate_count} người khác`);
    }

    const formattedValues = {
      ...values,
      move_in_date: values.move_in_date
        ? values.move_in_date.format("YYYY-MM-DD")
        : null,
      preferences: preferences.join(";"),
      status: "active",
      tenant_id: getAuthData()?.userId
    };

    const {roommate_count, ...submitValues} = formattedValues;

    dispatch(createNewPostFindRoom(submitValues)).unwrap();

    form.resetFields();
    setRoommateSelected(false);
    onClose();
  };

  const handleCancel = () => {
    form.resetFields();
    setRoommateSelected(false);
    onClose();
  };

  const handlePreferencesChange = (checkedValues: any[]) => {
    setRoommateSelected(checkedValues.includes("Ở chung với người khác"));
    if (!checkedValues.includes("Ở chung với người khác")) {
      form.setFieldsValue({ roommate_count: undefined });
    }
  };

  return (
    <Modal
      title={null}
      open={open}
      onCancel={handleCancel}
      footer={null}
      centered
      width={600}
      className="!p-0"
    >
      <div className="p-4">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleFinish}
          initialValues={{
            status: "active",
            budget: 0,
            move_in_date: dayjs(),
            preferences: [],
          }}
          className="space-y-6"
        >
          {/* Preferred Location */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
            <Form.Item
              label={
                <div className="flex items-center gap-2 text-gray-700 font-semibold">
                  <FaMapMarkerAlt className="text-[#E07B39]" />
                  Khu vực mong muốn
                </div>
              }
              name="preferred_location"
              rules={[
                { required: true, message: "Vui lòng nhập khu vực mong muốn!" },
              ]}
              className="!mb-0"
            >
              <TextArea
                rows={2}
                placeholder="VD: Quận 7, gần TDTU, gần chợ, gần trường học..."
                className="!rounded-xl !border-blue-200 focus:!border-[#E07B39] focus:!shadow-lg"
              />
            </Form.Item>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Budget */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-100">
              <Form.Item
                label={
                  <div className="flex items-center gap-2 text-gray-700 font-semibold">
                    <FaDollarSign className="text-green-600" />
                    Ngân sách
                  </div>
                }
                name="budget"
                className="!mb-0"
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập ngân sách (VND)"
                  min={0}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  className="!rounded-xl !border-green-200 focus:!border-green-500"
                />
              </Form.Item>
            </div>

            {/* Move in Date */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
              <Form.Item
                label={
                  <div className="flex items-center gap-2 text-gray-700 font-semibold">
                    <FaCalendarAlt className="text-purple-600" />
                    Ngày dọn vào
                  </div>
                }
                name="move_in_date"
                className="!mb-0"
              >
                <DatePicker
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                  className="!rounded-xl !border-purple-200 focus:!border-purple-500"
                />
              </Form.Item>
            </div>
          </div>

          {/* Preferences with Checkboxes */}
          <div className="bg-gradient-to-r from-orange-50 to-red-50 p-6 rounded-2xl border border-orange-100">
            <Form.Item
              label={
                <div className="flex items-center gap-2 text-gray-700 font-semibold mb-4">
                  <FaCog className="text-[#E07B39]" />
                  Yêu cầu & Tiện ích mong muốn
                </div>
              }
              name="preferences"
              className="!mb-0"
            >
              <Checkbox.Group
                onChange={handlePreferencesChange}
                className="w-full"
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Checkbox value="Ở chung với người khác" className="flex items-center p-3 rounded-xl">
                      <span>Ở chung với người khác</span>
                    </Checkbox>

                    <Checkbox value="Có chỗ để xe" className="flex items-center p-3 rounded-xl">
                      <span>Có chỗ để xe</span>
                    </Checkbox>

                    <Checkbox value="Giờ giấc tự do" className="flex items-center p-3 rounded-xl">
                      <span>Giờ giấc tự do</span>
                    </Checkbox>

                    <Checkbox value="Cho phép thú cưng" className="flex items-center p-3 rounded-xl">
                      <span>Cho phép thú cưng</span>
                    </Checkbox>
                  </div>

                  <div className="space-y-3">
                    <Checkbox value="Có cửa sổ trời" className="flex items-center p-3 rounded-xl">
                      <span>Có cửa sổ trời</span>
                    </Checkbox>

                    <Checkbox value="Nội thất cơ bản" className="flex items-center p-3 rounded-xl">
                      <span>Nội thất cơ bản</span>
                    </Checkbox>

                    <Checkbox value="Full nội thất" className="flex items-center p-3 rounded-xl">
                      <span>Full nội thất</span>
                    </Checkbox>

                    <Checkbox value="Có bảo vệ - ra vào vân tay" className="flex items-center p-3 rounded-xl">
                      <span>Có bảo vệ - ra vào vân tay</span>
                    </Checkbox>
                  </div>
                </div>
              </Checkbox.Group>
            </Form.Item>

            {/* Roommate Count - inline vào preferences string */}
            {roommateSelected && (
              <div className="mt-6 p-4 bg-white rounded-xl border border-gray-200">
                <Form.Item
                  label={
                    <div className="flex items-center gap-2 text-gray-700 font-medium">
                      <FaUsers className="text-blue-500" />
                      Số người ở chung mong muốn
                    </div>
                  }
                  name="roommate_count"
                  className="!mb-0"
                >
                  <InputNumber
                    min={1}
                    max={10}
                    placeholder="Nhập số người"
                    style={{ width: "100%" }}
                    className="!rounded-xl"
                  />
                </Form.Item>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              onClick={handleCancel}
              className="flex-1 h-12 rounded-xl border-2 border-gray-200 hover:border-gray-300 font-medium"
            >
              Hủy bỏ
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              className="flex-1 h-12 bg-gradient-to-r from-[#E07B39] to-[#ff8c42] border-none rounded-xl font-semibold text-white hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Tạo bài tìm trọ
            </Button>
          </div>
        </Form>
      </div>
    </Modal>
  );
};

export default AddRoomFinderModal;
