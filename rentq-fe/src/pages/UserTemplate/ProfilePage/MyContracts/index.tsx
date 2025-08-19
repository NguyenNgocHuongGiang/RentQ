import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../../store";
import { useEffect, useState } from "react";
import { getContractByTenantID } from "../../../../store/slice/contractSlice";
import { checkLogin, getAuthData } from "../../../../utils/helpers";
import { ContractType } from "../../../../types/types";
import moment from "moment";
import { EyeOutlined } from "@ant-design/icons";
import { Button, DatePicker, Empty, Input, Tooltip } from "antd";
import ReviewContractModal from "../../../../components/Modal/ReviewContractModal";
import { useNavigate } from "react-router-dom";
const { Search } = Input;
const MyContracts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { listContracts } = useSelector((state: any) => state.constractReducer);
  const [searchAddress, setSearchAddress] = useState("");
  const [filterEndDate, setFilterEndDate] = useState(null);
  const [isReviewed, setIsReviewed] = useState(false);
  const [contractToReview, setContractToReview] = useState<ContractType | null>(
    null
  );

  useEffect(() => {
    checkLogin(navigate);
    dispatch(getContractByTenantID(getAuthData()?.userId)).unwrap();
  }, []);

  const handleViewContract = (contract: ContractType) => {
    if (!contract) return;
    const pdfUrl = contract?.contract_file_url;
    if (pdfUrl) {
      window.open(pdfUrl, "_blank");
    }
  };

  return (
    <div>
      {listContracts?.length > 0 ? (
        <div>
          <div className="flex items-center gap-4 mb-4">
            <Search
              placeholder="Search by address"
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              allowClear
              className="w-1/2"
            />
            <DatePicker
              placeholder="Filter by end date"
              value={filterEndDate}
              onChange={(date) => setFilterEndDate(date)}
              className="w-1/2"
              allowClear
            />
          </div>
          <table className="min-w-full bg-white border border-gray-200 shadow-sm rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-center px-4 py-3 border-b">#</th>
                <th className="text-center px-4 py-3 border-b">
                  Room - Address
                </th>
                <th className="text-center px-4 py-3 border-b">Start Date</th>
                <th className="text-center px-4 py-3 border-b">End Date</th>
                <th className="text-center px-4 py-3 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {listContracts?.map((contract: ContractType, index: number) => (
                <tr key={contract.contract_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 border-b text-center">
                    {index + 1}
                  </td>
                  <td className="px-4 py-3 border-b">
                    <Tooltip title={contract.properties?.address}>
                      <span className="block text-center">
                        {contract.properties?.address &&
                        contract.properties.address.length > 30
                          ? `${contract.properties.address.slice(0, 30)}...`
                          : contract.properties?.address || ""}
                      </span>
                    </Tooltip>
                  </td>
                  <td className="px-4 py-3 border-b text-center">
                    {moment(contract.start_date).format("DD/MM/YYYY")}
                  </td>
                  <td className="px-4 py-3 border-b text-center">
                    {moment(contract.end_date).format("DD/MM/YYYY")}
                  </td>
                  <td className="px-4 py-3 border-b text-center">
                    <div className="flex justify-center space-x-4">
                      <Tooltip title="View Contract Details">
                        <button
                          onClick={() =>
                            contract.contract_id !== undefined &&
                            handleViewContract(contract)
                          }
                          className="text-blue-600 hover:text-blue-800 transition text-xl cursor-pointer"
                        >
                          <EyeOutlined />
                        </button>
                      </Tooltip>
                      <Tooltip title="Click to accept or reject the contract">
                        <Button
                          type="primary"
                          onClick={() => {
                            setContractToReview(contract);
                            setIsReviewed(true);
                          }}
                        >
                          Review
                        </Button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex justify-center items-center h-[300px]">
          <Empty />
        </div>
      )}

      {contractToReview && (
        <ReviewContractModal
          open={isReviewed}
          onClose={() => setIsReviewed(false)}
          contract={contractToReview}
        />
      )}
    </div>
  );
};

export default MyContracts;
