import { Button, Tooltip, Card, Badge, Space } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  MinusCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { getAuthData } from "../../../../utils/helpers";

const allBills = [
  {
    id: 1,
    name: "Electricity Bill",
    date: "2025-08-28",
    status: "paid",
    receiverId: 2,
    amount: "1,250,000 VND",
  },
  {
    id: 2,
    name: "Water Bill",
    date: "2025-08-25",
    status: "pending",
    receiverId: 2,
    amount: "450,000 VND",
  },
  {
    id: 3,
    name: "Internet Bill",
    date: "2025-08-20",
    status: "overdue",
    receiverId: 2,
    amount: "800,000 VND",
  },
  {
    id: 4,
    name: "Internet Bill",
    date: "2025-08-20",
    status: "overdue",
    receiverId: 2,
    amount: "800,000 VND",
  },
];

export default function MyBills() {
  const userId = getAuthData()?.userId;
  const [bills] = useState(allBills.filter((b) => b.receiverId === userId));

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "paid":
        return {
          icon: <CheckCircleOutlined className="text-xl" />,
          color: "#52c41a",
          text: "Đã thanh toán",
          badgeStatus: "success" as const,
        };
      case "pending":
        return {
          icon: <MinusCircleOutlined className="text-xl" />,
          color: "#faad14",
          text: "Chờ thanh toán",
          badgeStatus: "warning" as const,
        };
      default:
        return {
          icon: <CloseCircleOutlined className="text-xl" />,
          color: "#ff4d4f",
          text: "Quá hạn",
          badgeStatus: "error" as const,
        };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 text-center bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20">
          <h2 className="text-3xl font-bold text-blue-600 mb-2 drop-shadow-sm">
            💳 Hóa đơn của bạn
          </h2>
          <p className="text-gray-600">
            Quản lý và theo dõi các hóa đơn của bạn
          </p>
        </div>

        {/* Bills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bills.map((bill) => {
            const statusConfig = getStatusConfig(bill.status);

            return (
              <Card
                key={bill.id}
                hoverable
                className="rounded-2xl border-0 shadow-xl bg-gradient-to-br from-white to-gray-50 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                bodyStyle={{ padding: "24px" }}
              >
                {/* Card Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 leading-tight">
                      {bill.name}
                    </h3>
                    <Space direction="vertical" size="small" className="w-full">
                      <div className="flex items-center text-gray-600">
                        <CalendarOutlined className="mr-2 text-blue-500" />
                        <span className="text-sm">{formatDate(bill.date)}</span>
                      </div>
                      <div className="text-base font-semibold text-blue-600">
                        {bill.amount}
                      </div>
                    </Space>
                  </div>

                  <Badge
                    status={statusConfig.badgeStatus}
                    text={
                      <span
                        className="text-xs font-medium"
                        style={{ color: statusConfig.color }}
                      >
                        {statusConfig.text}
                      </span>
                    }
                  />
                </div>

                {/* Card Footer */}
                <div className="flex justify-end items-center pt-4 border-t border-gray-100 space-x-2">
                  {bill.status === "pending" && (
                    <Button
                      type="primary"
                      size="middle"
                      className="!bg-green-500 text-white rounded-lg font-medium h-9 px-4 shadow-md hover:shadow-lg transition-all duration-200"
                      onClick={() => alert(`Thanh toán hóa đơn ${bill.name}`)}
                    >
                      Thanh toán
                    </Button>
                  )}

                  <Button
                    type="primary"
                    size="middle"
                    className="rounded-lg font-medium h-9 px-4 shadow-md hover:shadow-lg transition-all duration-200"
                    onClick={() => alert(`Xem chi tiết hóa đơn ${bill.name}`)}
                  >
                    Xem chi tiết
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {bills.length === 0 && (
          <Card className="text-center p-12 rounded-2xl shadow-xl border-0 bg-gradient-to-br from-white to-gray-50">
            <div className="text-5xl mb-4">📄</div>
            <h3 className="text-gray-600 text-lg font-medium mb-2">
              Không có hóa đơn nào
            </h3>
            <p className="text-gray-500">
              Bạn chưa có hóa đơn nào cần thanh toán
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
