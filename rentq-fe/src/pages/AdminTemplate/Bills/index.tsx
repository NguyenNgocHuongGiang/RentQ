import { Button, DatePicker, Input } from "antd";
import { useEffect, useState } from "react";
import {
  PlusOutlined,
  EyeOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store";
import { getAuthData } from "../../../utils/helpers";
import moment from "moment";
import { BillType, ContractType } from "../../../types/types";
import AddBillModal from "../../../components/Modal/AddBillModal";
import { getLandlordContracts } from "../../../store/slice/contractSlice";
import { deleteBill, getLandlordBills } from "../../../store/slice/billSlice";
import dayjs from "dayjs";
import ViewBillDetailModal from "../../../components/Modal/ViewBillDetailModal";
import { toast } from "react-toastify";

const BillPage = () => {
  const { listBills } = useSelector((state: any) => state.billReducer);
  const { listContracts } = useSelector((state: any) => state.constractReducer);

  const dispatch = useDispatch<AppDispatch>();

  const [isOpenBillModal, setIsOpenBillModal] = useState(false);
  const [isOpenViewBillModal, setIsOpenViewBillModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchMonth, setSearchMonth] = useState<dayjs.Dayjs | null>(null);
  const [billDataView, setBillDataView] = useState<BillType | null>(null);

  useEffect(() => {
    dispatch(getLandlordContracts(getAuthData()?.userId)).unwrap();
    dispatch(
      getLandlordBills({
        user_id: getAuthData()?.userId,
        yearNumber: new Date().getFullYear().toString(),
      })
    );
  }, []);

  const handleViewBill = (bill: BillType) => {
    setIsOpenViewBillModal(true)
    setBillDataView(bill);
  };

  const handleDeleteBill = (billId: number) => {
    dispatch(deleteBill(billId))
      .unwrap()
      .then(() => toast.success("Bill deleted successfully!"))
      .catch(() => toast.error("Failed to delete bill!"));
  };

  const filteredBills = listBills?.filter((bill: BillType) => {
    const search = searchText.trim().toLowerCase();
    const selectedMonth = searchMonth ? searchMonth.format("YYYY-MM") : null;

    const contract = listContracts?.find(
      (c: ContractType) => c.contract_id === bill.contract_id
    );
    const address = contract?.properties?.address || "";

    let match = true;

    if (search) {
      match =
        bill.bill_id?.toString().includes(search) ||
        bill.status?.toLowerCase().includes(search.toLowerCase()) ||
        address.toLowerCase().includes(search.toLowerCase());
    }

    if (selectedMonth) {
      const billMonth = dayjs(bill.due_date).format("YYYY-MM");
      match = match && billMonth === selectedMonth;
    }

    return match;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Input.Search
            placeholder="Search bill"
            allowClear
            className="w-72"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <DatePicker
            picker="month"
            className="w-65"
            placeholder="Search by month"
            value={searchMonth}
            onChange={(date) => setSearchMonth(date)}
          />
        </div>

        <Button
          className="!bg-[#483507] !text-white !hover:bg-[#c2bdb5] !hover:text-[#483507] !border-none"
          icon={<PlusOutlined />}
          onClick={() => setIsOpenBillModal(true)}
        >
          Add Bill
        </Button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-center px-4 py-3 border-b">#</th>
              <th className="text-center px-4 py-3 border-b">Address</th>
              <th className="text-center px-4 py-3 border-b">Due Date</th>
              <th className="text-center px-4 py-3 border-b">Total Amount</th>
              <th className="text-center px-4 py-3 border-b">Status</th>
              <th className="text-center px-4 py-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBills?.map((bill: BillType, index: number) => {
              return (
                <tr key={bill.bill_id} className={`hover:bg-gray-50 `}>
                  <td className="px-4 py-3 border-b text-center">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 border-b text-center">
                    {listContracts?.find(
                      (b: ContractType) => b.contract_id === bill.contract_id
                    )?.properties?.address || "N/A"}
                  </td>
                  <td className="px-4 py-3 border-b text-center">
                    {moment(bill.due_date).format("DD/MM/YYYY")}
                  </td>
                  <td className="px-4 py-3 border-b text-center">
                    {bill.total_amount.toLocaleString()} VND
                  </td>
                  <td className="px-4 py-3 border-b text-center">
                    {bill.status === "PAID" ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        PAID
                      </span>
                    ) : bill.status === "UNPAID" ? (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        UNPAID
                      </span>
                    ) : (
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                        CANCELLED
                      </span>
                    )}
                  </td>

                  <td className="px-4 py-3 border-b text-center">
                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => handleViewBill(bill)}
                        className="text-blue-600 hover:text-blue-800 transition text-xl"
                        title="View bill"
                      >
                        <EyeOutlined />
                      </button>
                      <button
                        onClick={() => handleDeleteBill(bill.bill_id ?? 0)}
                        className="text-red-600 hover:text-red-800 transition text-xl"
                        title="Delete bill"
                      >
                        <DeleteOutlined />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal add/edit bill */}
      <AddBillModal
        isOpen={isOpenBillModal}
        onClose={() => {
          setIsOpenBillModal(false);
        }}
      />

      <ViewBillDetailModal open={isOpenViewBillModal} onClose={() => setIsOpenViewBillModal(false)} bill={billDataView} />
      
    </div>
  );
};

export default BillPage;
