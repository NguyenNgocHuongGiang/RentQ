import { Button, Input } from "antd";
import { useEffect, useState } from "react";
import {
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../store";
import { getLandlordContracts } from "../../../store/slice/contractSlice";
import { getAuthData } from "../../../utils/helpers";
import { ContractType } from "../../../types/types";
import moment from "moment";
import AddContractModal from "../../../components/Modal/AddContractModal";

const ContractsPage = () => {
  const { listContracts } = useSelector((state: any) => state.constractReducer);
  const dispatch = useDispatch<AppDispatch>();
  const [isOpenContractModal, setIsOpenContractModal] = useState(false);

  useEffect(() => {
    dispatch(getLandlordContracts(getAuthData()?.userId)).unwrap();
  }, []);

  const handleViewPDF = (contractId: number) => {
    const contract = listContracts.find(
      (item: ContractType) => item.contract_id === contractId
    );
    if (contract && contract.contract_file_url) {
      window.open(contract.contract_file_url, "_blank");
    } else {
      alert("Contract PDF not found.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <Input.Search
          placeholder="Search contracts"
          allowClear
          style={{ maxWidth: 300 }}
        />

        <Button
          className="!bg-[#483507] !text-white !hover:bg-[#c2bdb5] !hover:text-[#483507] !border-none"
          icon={<PlusOutlined />}
          onClick={() => setIsOpenContractModal(true)}
        >
          Add contract
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-center px-4 py-3 border-b">#</th>
              <th className="text-center px-4 py-3 border-b">Room - Address</th>
              <th className="text-center px-4 py-3 border-b">Start Date</th>
              <th className="text-center px-4 py-3 border-b">End Date</th>
              <th className="text-center px-4 py-3 border-b">Duration</th>
              <th className="text-center px-4 py-3 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {listContracts?.map((contract: ContractType, index: number) => (
              <tr key={contract.contract_id} className="hover:bg-gray-50">
                <td className="px-4 py-3 border-b text-center">{index + 1}</td>
                <td className="px-4 py-3 border-b">
                  {contract.properties?.address}
                </td>
                <td className="px-4 py-3 border-b text-center">
                  {moment(contract.start_date).format("DD/MM/YYYY")}
                </td>
                <td className="px-4 py-3 border-b text-center">
                  {moment(contract.end_date).format("DD/MM/YYYY")}
                </td>
                <td className="px-4 py-3 border-b text-center">
                  {contract.end_date && contract.start_date
                    ? (() => {
                        const duration = moment.duration(
                          moment(contract.end_date).diff(
                            moment(contract.start_date)
                          )
                        );
                        const years = duration.years();
                        const months = duration.months();
                        const days = duration.days();
                        return `${years > 0 ? `${years} năm ` : ""}${
                          months > 0 ? `${months} tháng ` : ""
                        }${days > 0 ? `${days} ngày` : ""}`;
                      })()
                    : "....."}{" "}
                </td>
                <td className="px-4 py-3 border-b text-center">
                  <div className="flex justify-center space-x-4">
                    <button
                      onClick={() =>
                        contract.contract_id !== undefined &&
                        handleViewPDF(contract.contract_id)
                      }
                      className="text-blue-600 hover:text-blue-800 transition text-xl cursor-pointer"
                      title="View PDF"
                    >
                      <EyeOutlined />
                    </button>
                    <button
                      onClick={() => {}}
                      className="text-orange-600 hover:text-orange-800 transition text-xl"
                      title="Update PDF"
                    >
                      <EditOutlined />
                    </button>
                    <button
                      onClick={() => {}}
                      className="text-red-600 hover:text-red-800 transition text-xl"
                      title="Delete PDF"
                    >
                      <DeleteOutlined />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddContractModal
        isOpen={isOpenContractModal}
        onClose={() => setIsOpenContractModal(false)}
      />
    </div>
  );
};

export default ContractsPage;
