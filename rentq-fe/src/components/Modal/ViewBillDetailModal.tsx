import { Modal, Descriptions, Tag, Table, Button } from "antd";
import { BillType, BillItemType, ContractType } from "../../types/types";
import { useSelector } from "react-redux";
import { DownloadOutlined } from "@ant-design/icons";
import html2pdf from "html2pdf.js";

interface ViewBillDetailModalProps {
  open: boolean;
  onClose: () => void;
  bill: BillType | null;
}

export default function ViewBillDetailModal({
  open,
  onClose,
  bill,
}: ViewBillDetailModalProps) {
  const { listContracts } = useSelector((state: any) => state.constractReducer);

  if (!bill) return null;

  const columns = [
    {
      title: "Loại phí",
      dataIndex: "item_type",
      key: "item_type",
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Chỉ số đầu",
      dataIndex: "start_number",
      key: "start_number",
      align: "center" as const,
    },
    {
      title: "Chỉ số cuối",
      dataIndex: "end_number",
      key: "end_number",
      align: "center" as const,
    },
    {
      title: "Số tiền (đ)",
      dataIndex: "amount",
      key: "amount",
      align: "right" as const,
      render: (value: string) => Number(value).toLocaleString(),
    },
    {
      title: "Thành tiền (đ)",
      key: "total_price",
      align: "right" as const,
      render: (_: any, record: BillItemType) => {
        const start = Number(record.start_number);
        const end = Number(record.end_number);
        const amount = Number(record.amount);

        let total: number;

        if (start != 0 || end != 0) {
          total = (end - start) * amount;
        } else {
          total = amount;
        }

        return total.toLocaleString();
      },
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
    },
  ];

  const handleDownload = () => {
    const element = document.getElementsByClassName(
      "bill-preview"
    )[0] as HTMLElement;
    if (!element) return;

    const stripOklch = (el: HTMLElement) => {
      const styles = window.getComputedStyle(el);
      ["color", "backgroundColor", "borderColor"].forEach((prop) => {
        const val = styles.getPropertyValue(prop);
        if (val.includes("oklch")) {
          (el.style as any)[prop] = "#000";
        }
      });
      Array.from(el.children).forEach((c) => stripOklch(c as HTMLElement));
    };
    stripOklch(element);

    const opt = {
      margin: [0.5, 1],
      filename: `bill-${bill.bill_id}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        foreignObjectRendering: true,
      },
      jsPDF: { unit: "in", format: [18, 8], orientation: "landscape" },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      centered
      className="rounded-2xl"
      width={900}
      footer={[
        <Button key="close" onClick={onClose} className="my-4">
          Đóng
        </Button>,
        <Button
          key="download"
          type="primary"
          icon={<DownloadOutlined />}
          className="!text-white !bg-[#0A2E50] rounded-lg font-medium h-9 px-4 shadow !hover:text-[#0A2E50] !hover:bg-white transition-all duration-200"
          onClick={handleDownload}
        >
          Tải xuống
        </Button>,
      ]}
    >
      <div className="bill-preview">
        <div style={{ textAlign: "center" }} className="mb-6">
          <div className="font-bold text-2xl my-2 uppercase">
            Chi tiết hóa đơn
          </div>
          <div className="font-semibold text-lg mb-5">
            {bill.due_date
              ? `Tháng ${new Date(bill.due_date).toLocaleDateString("ES", {
                  month: "2-digit",
                  year: "numeric",
                })}`
              : "Chưa có ngày"}
          </div>
        </div>

        <Descriptions bordered column={2} size="middle">
          <Descriptions.Item label="Mã hóa đơn">
            {bill.bill_id}
          </Descriptions.Item>
          <Descriptions.Item label="Phòng - địa chỉ">
            {listContracts?.find(
              (c: ContractType) => c.contract_id === bill.contract_id
            )?.properties?.address || "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày đến hạn">
            {bill.due_date
              ? new Date(bill.due_date).toLocaleDateString("vi-VN")
              : "N/A"}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái">
            {bill.status === "PAID" ? (
              <Tag color="green">Đã thanh toán</Tag>
            ) : bill.status === "UNPAID" ? (
              <Tag color="red">Chưa thanh toán</Tag>
            ) : (
              <Tag color="default">Đã hủy</Tag>
            )}
          </Descriptions.Item>
        </Descriptions>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Chi tiết các khoản phí</h3>
          <Table<BillItemType>
            dataSource={bill.bill_items || []}
            columns={columns}
            rowKey={(record) =>
              record.item_id ??
              String(record.bill_id) + record.item_type + record.description
            }
            pagination={false}
            bordered
            size="middle"
            summary={() => {
              return (
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={5} align="right">
                    <b>Tổng cộng</b>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={1} align="right">
                    <b>{Number(bill.total_amount).toLocaleString()} đ</b>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={2} />
                </Table.Summary.Row>
              );
            }}
          />
        </div>
      </div>
    </Modal>
  );
}
