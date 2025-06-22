import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../../../store";
import { useEffect, useState } from "react";
import { getContractByTenantID } from "../../../../store/slice/contractSlice";
import { getAuthData } from "../../../../utils/helpers";
import { ContractType } from "../../../../types/types";
import moment from "moment";
import { EyeOutlined } from "@ant-design/icons";
import { DatePicker, Input, Tooltip } from "antd";
const { Search } = Input;
const MyContracts = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { listContracts } = useSelector((state: any) => state.constractReducer);
  const [searchAddress, setSearchAddress] = useState("");
  const [filterEndDate, setFilterEndDate] = useState(null);

  useEffect(() => {
    dispatch(getContractByTenantID(getAuthData()?.userId)).unwrap();
  }, []);

  return (
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
                    onClick={() => {}}
                    className="text-blue-600 hover:text-blue-800 transition text-xl cursor-pointer"
                    title="View PDF"
                  >
                    <EyeOutlined />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyContracts;
