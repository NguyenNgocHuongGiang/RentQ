import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { getUserProperties } from "../../../store/slice/propertySlice";
import { getAuthData } from "../../../utils/helpers";
import { getLandlordContracts } from "../../../store/slice/contractSlice";
import { getLandlordBills } from "../../../store/slice/billSlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart
} from "recharts";
import { BillType, ContractType, PropertyType } from "../../../types/types";
import dayjs from "dayjs";

// interface Property {
//   id: string;
//   name: string;
//   type: string;
//   status: string;
//   monthlyRent: number;
// }

// interface Contract {
//   id: string;
//   propertyId: string;
//   status: string;
//   startDate: string;
//   endDate: string;
//   monthlyRent: number;
// }

// interface Bill {
//   id: string;
//   contractId: string;
//   amount: number;
//   dueDate: string;
//   status: string;
//   type: string;
//   month: number;
// }

const Dashboard = () => {
  const dispatch = useDispatch<AppDispatch>();

  // Lấy state từ Redux
  const { listProperties } = useSelector((state: RootState) => state.propertyReducer);
  const { listContracts } = useSelector((state: RootState) => state.constractReducer);
  const { listBills } = useSelector((state: RootState) => state.billReducer);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = getAuthData();
        if (!auth?.userId) return;

        const userId = auth.userId;
        const year = new Date().getFullYear().toString();

        await Promise.all([
          dispatch(getUserProperties(userId)).unwrap(),
          dispatch(getLandlordContracts(userId)).unwrap(),
          dispatch(getLandlordBills({ user_id: userId, yearNumber: year })).unwrap(),
        ]);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    };

    fetchData();
  }, [dispatch]);

  // Tính toán dữ liệu cho biểu đồ
  const dashboardData = useMemo(() => {
    const properties = listProperties as PropertyType[] || [];
    const contracts = listContracts as ContractType[] || [];
    const bills = listBills as BillType[] || [];

    // Thống kê properties theo type
    const propertyByType = properties.reduce((acc, prop) => {
      acc[prop.property_type] = (acc[prop.property_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const propertyTypeData = Object.entries(propertyByType).map(([type, count]) => ({
      type,
      count,
    }));

    // Thống kê contract status
    const contractByStatus = contracts.reduce((acc, contract) => {
      acc[contract.status] = (acc[contract.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const contractStatusData = Object.entries(contractByStatus).map(([status, count]) => ({
      status,
      count,
    }));

    console.log(contractStatusData);
    

    // Doanh thu theo tháng (từ bills)
    const revenueByMonth = Array.from({ length: 12 }, (_, index) => {
      const month = index + 1;
      const monthBills = bills.filter(bill => dayjs(bill.bill_date).month() + 1 === month && bill.status === 'PAID');
      const revenue = monthBills.reduce((sum, bill) => sum + bill.total_amount, 0);
      return {
        month: `T${month}`,
        revenue,
        billCount: monthBills.length,
      };
    });

    // Thống kê bills theo status
    const billsByStatus = bills.reduce((acc, bill) => {
      acc[bill.status] = (acc[bill.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Tính tổng doanh thu
    const totalRevenue = bills
      .filter(bill => bill.status === 'PAID')
      .reduce((sum, bill) => sum + bill.total_amount, 0);

    // Tính doanh thu tháng hiện tại
    const currentMonth = new Date().getMonth() + 1;
    const currentMonthRevenue = bills
      .filter(bill => dayjs(bill.bill_date).month() + 1 === currentMonth && bill.status === 'PAID')
      .reduce((sum, bill) => sum + bill.total_amount, 0);

    // Properties đang hoạt động
    // const activeProperties = properties.filter(prop => prop. === 'active').length;

    // Contracts sắp hết hạn (trong 30 ngày tới)
    const today = new Date();
    const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    const expiringContracts = contracts.filter(contract => {
      const endDate = new Date(contract.end_date || "");
      return endDate >= today && endDate <= thirtyDaysLater;
    }).length;

    // Bills chưa thanh toán
    const unpaidBills = bills.filter(bill => bill.status === 'UNPAID').length;

    return {
      propertyTypeData,
      contractStatusData,
      revenueByMonth,
      billsByStatus,
      stats: {
        totalProperties: properties.length,
        totalContracts: contracts.length,
        totalBills: bills.length,
        // activeProperties,
        expiringContracts,
        unpaidBills,
        totalRevenue,
        currentMonthRevenue,
      }
    };
  }, [listProperties, listContracts, listBills]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(value);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      <h1 className="text-3xl font-bold text-[#0A2E50] mb-8">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium opacity-90">Total Properties</h3>
              <p className="text-3xl font-bold">{dashboardData.stats.totalProperties}</p>
              {/* <p className="text-sm opacity-75">
                {dashboardData.stats.activeProperties} active
              </p> */}
            </div>
            <div className="text-4xl opacity-80">🏢</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium opacity-90">Total Revenue</h3>
              <p className="text-3xl font-bold">
                {(dashboardData.stats.totalRevenue / 1000000).toFixed(1)}M
              </p>
              <p className="text-sm opacity-75">
                This month: {(dashboardData.stats.currentMonthRevenue / 1000000).toFixed(1)}M
              </p>
            </div>
            <div className="text-4xl opacity-80">💰</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium opacity-90">Contracts</h3>
              <p className="text-3xl font-bold">{dashboardData.stats.totalContracts}</p>
              <p className="text-sm opacity-75">
                {dashboardData.stats.expiringContracts} expiring soon
              </p>
            </div>
            <div className="text-4xl opacity-80">📄</div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium opacity-90">Bills</h3>
              <p className="text-3xl font-bold">{dashboardData.stats.totalBills}</p>
              <p className="text-sm opacity-75">
                {dashboardData.stats.unpaidBills} unpaid
              </p>
            </div>
            <div className="text-4xl opacity-80">🧾</div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Month */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Monthly Revenue</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dashboardData.revenueByMonth}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#0A2E50"
                fill="#0A2E50"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Property Types */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Properties by Type</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dashboardData.propertyTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ type, percent }) =>
                  `${type} (${percent ? (percent * 100).toFixed(0) : 0}%)`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="count"
              >
                {dashboardData.propertyTypeData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contract Status */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Contract Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dashboardData.contractStatusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Bills Overview */}
        <div className="bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Bills Overview</h2>
          <div className="space-y-4">
            {Object.entries(dashboardData.billsByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${status === 'paid' ? 'bg-green-500' :
                      status === 'unpaid' ? 'bg-red-500' : 'bg-yellow-500'
                    }`}></div>
                  <span className="font-medium capitalize">{status}</span>
                </div>
                <span className="text-2xl font-bold text-gray-700">{count}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <ResponsiveContainer width="100%" height={150}>
              <LineChart data={dashboardData.revenueByMonth}>
                <XAxis dataKey="month" />
                <YAxis hide />
                <Tooltip
                  formatter={(value: number) => [value, 'Bills Count']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Line
                  type="monotone"
                  dataKey="billCount"
                  stroke="#FF8042"
                  strokeWidth={3}
                  dot={{ fill: '#FF8042' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <span className="text-2xl mb-2">🏠</span>
            <span className="text-sm font-medium text-blue-700">Add Property</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <span className="text-2xl mb-2">📋</span>
            <span className="text-sm font-medium text-green-700">New Contract</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <span className="text-2xl mb-2">💳</span>
            <span className="text-sm font-medium text-purple-700">Create Bill</span>
          </button>
          <button className="flex flex-col items-center p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors">
            <span className="text-2xl mb-2">📊</span>
            <span className="text-sm font-medium text-orange-700">View Reports</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;