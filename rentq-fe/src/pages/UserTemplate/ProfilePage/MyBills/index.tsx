import { Button, Card, Badge, Space } from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  MinusCircleOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { getAuthData } from "../../../../utils/helpers";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../../store";
import { getTenantBills } from "../../../../store/slice/billSlice";
import { BillType, ContractType } from "../../../../types/types";
import { getContractByTenantID } from "../../../../store/slice/contractSlice";
import ViewBillDetailModal from "../../../../components/Modal/ViewBillDetailModal";
import { PaymentModal } from "../../../../components/Modal/PaymentModal";

export default function MyBills() {
  const userId = getAuthData()?.userId;
  const { listBills } = useSelector((state: any) => state.billReducer);
  const { listContracts } = useSelector((state: any) => state.constractReducer);
  const [billDataView, setBillDataView] = useState<BillType | null>(null);
  const [isOpenViewBillModal, setIsOpenViewBillModal] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [currentBill, setCurrentBill] = useState<BillType | null>(null);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(getTenantBills(userId));
    dispatch(getContractByTenantID(getAuthData()?.userId)).unwrap();
  }, []);

  const handleViewBill = (bill: BillType) => {
    setIsOpenViewBillModal(true);
    setBillDataView(bill);
  };
  const handlePayment = (bill: BillType) => {
    setCurrentBill(bill);
    setIsPaymentModalOpen(true);
  };

  const handleClosePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setCurrentBill(null);
  };

  const handlePay = (method: string, note?: string) => {
    console.log("Thanh toán bill:", currentBill?.bill_id, "Method:", method, "Note:", note);
    setIsPaymentModalOpen(false);
    setCurrentBill(null);
  };
  const getStatusConfig = (status: string, dueDate: string | Date | null) => {
    const now = new Date();
    const due = dueDate ? new Date(dueDate) : null;

    if (status === "UNPAID" && due && now > due) {
      // Chưa thanh toán nhưng quá hạn
      return {
        icon: <CloseCircleOutlined className="text-xl" />,
        color: "#ff4d4f",
        text: "Quá hạn",
        badgeStatus: "error" as const,
      };
    }

    switch (status) {
      case "PAID":
        return {
          icon: <CheckCircleOutlined className="text-xl" />,
          color: "#52c41a",
          text: "Đã thanh toán",
          badgeStatus: "success" as const,
        };
      case "UNPAID":
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

  return (
    <div className="min-h-screen p-3 ">
      <div className="max-w-6xl mx-auto">
        {/* Bills Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {listBills.map((bill: BillType) => {
            const statusConfig = getStatusConfig(bill.status, bill.due_date);
            const contract = listContracts.find(
              (c: ContractType) => c.contract_id === bill.contract_id
            );
            return (
              <Card
                key={bill.bill_id}
                hoverable
                className="rounded-2xl border-0 shadow-lg bg-gradient-to-br from-[#F0F2F5] to-white transition-all duration-300 hover:shadow-2xl"
                bodyStyle={{ padding: "24px" }}
              >
                {/* Card Header */}
                <div className="flex justify-between items-start mb-4 gap-2">
                  <div className="flex-3/5 ">
                    <h3 className="text-[16px] font-semibold text-[#0A2E50] mb-2 leading-tight line-clamp-1">
                      {bill.due_date && contract?.properties?.address
                        ? `${new Date(bill.due_date).toLocaleDateString("es", {
                          month: "2-digit",
                          year: "numeric",
                        })} - ${contract.properties.address}`
                        : contract?.properties?.address || "Chưa có địa chỉ"}
                    </h3>

                    <Space direction="vertical" size="small" className="w-full">
                      <div className="flex items-center text-gray-600">
                        <CalendarOutlined className="mr-2 text-[#E07B39]" />
                        <span className="text-sm">
                          {bill.due_date
                            ? new Date(bill.due_date).toLocaleDateString(
                              "vi-VN",
                              {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              }
                            )
                            : "Chưa có ngày"}
                        </span>
                      </div>
                      <div className="text-lg font-bold text-[#0A2E50]">
                        {bill.total_amount.toLocaleString()} VND
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
                <div className="flex justify-end items-center pt-4 border-t border-gray-200 space-x-2">
                  {bill.status === "UNPAID" && (
                    <Button
                      type="primary"
                      size="middle"
                      className="!bg-[#E07B39] !text-white rounded-lg font-medium h-9 px-4 shadow !hover:bg-[#0A2E50] !hover:text-[#F0F2F5] transition-all duration-200"
                      onClick={() => handlePayment(bill)}
                    >
                      Thanh toán
                    </Button>
                  )}

                  <Button
                    type="primary"
                    size="middle"
                    className="!text-white !bg-[#0A2E50] rounded-lg font-medium h-9 px-4 shadow !hover:text-[#0A2E50] !hover:bg-white transition-all duration-200"
                    onClick={() => {
                      handleViewBill(bill);
                    }}
                  >
                    Xem chi tiết
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {listBills.length === 0 && (
          <Card className="text-center p-12 !border-none">
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
      <ViewBillDetailModal
        open={isOpenViewBillModal}
        onClose={() => setIsOpenViewBillModal(false)}
        bill={billDataView}
      />
      {currentBill && (
        <PaymentModal
          visible={isPaymentModalOpen}
          bill={currentBill}
          onClose={handleClosePaymentModal}
          onPay={handlePay}
        />
      )}
    </div>
  );
}
