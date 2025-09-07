import { useEffect, useState } from "react";
import { Pagination, Spin, Empty, Card, Select, Space, Typography } from "antd";
import { LoadingOutlined, UserOutlined, HomeOutlined, SearchOutlined } from "@ant-design/icons";
import { getActiveRoommateRequest } from "../../../store/slice/roomFinderSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store";
import { RoommateRequestCard } from "../../../components/Card/RoommateRequestCard";

const { Title, Text } = Typography;
const { Option } = Select;

const RoommateRequestPage = () => {
  const [listActiveRoommateRequest, setListActiveRoommateRequest] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<string>(""); // state cho filter
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await dispatch(
          getActiveRoommateRequest({ page, limit: 10 })
        ).unwrap();
        setListActiveRoommateRequest(result.data);
        setTotal(result.total);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, dispatch]);

  const handleSort = (value: string) => {
    setSort(value);

    let sortedList = [...listActiveRoommateRequest];

    if (value === "oldest") {
      sortedList.sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    } else {
      sortedList.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    setListActiveRoommateRequest(sortedList);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Spin
              indicator={<LoadingOutlined className="text-4xl text-blue-500" spin />}
              size="large"
            />
            <div className="mt-8 text-center">
              <Title level={3} className="text-gray-700 mb-3">
                Đang tìm kiếm roommate...
              </Title>
              <Text className="text-gray-500 text-base">
                Vui lòng chờ trong giây lát để chúng tôi tìm những lựa chọn tốt nhất cho bạn
              </Text>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mt-12 max-w-5xl">
              {[1, 2, 3, 4].map((item) => (
                <Card
                  key={item}
                  loading={true}
                  className="rounded-2xl border-gray-200 h-48"
                />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Filter Bar */}
            <Card className="rounded-2xl shadow-lg mb-8 border-gray-100">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <Space align="center" size="large">
                  <Space align="center">
                    <SearchOutlined className="text-gray-500 text-lg" />
                    <Text strong className="text-gray-700">
                      Bộ lọc nâng cao
                    </Text>
                  </Space>

                  <div className="h-8 w-px bg-gray-300"></div>

                  <Select
                    value={sort}
                    placeholder="Sắp xếp"
                    className="w-36"
                    size="large"
                    onChange={handleSort}
                  >
                    <Option value="">Mới nhất</Option>
                    <Option value="oldest">Cũ nhất</Option>
                  </Select>
                </Space>

                <Space align="center" className="text-gray-600">
                  <HomeOutlined />
                  <Text>
                    Hiển thị {listActiveRoommateRequest.length} / {total} kết quả
                  </Text>
                </Space>
              </div>
            </Card>

            {/* Content Grid */}
            {listActiveRoommateRequest.length > 0 ? (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-8">
                  {listActiveRoommateRequest.map((item: any) => (
                    <div
                      key={item.id}
                      className="transform hover:scale-100 transition-all duration-300 "
                    >
                      <RoommateRequestCard item={item} />
                    </div>
                  ))}
                </div>

                <div className="flex justify-center">
                  <Pagination
                    current={page}
                    pageSize={10}
                    total={total}
                    onChange={(p) => {
                      setPage(p);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    showSizeChanger={false}
                    showQuickJumper={false}
                  />
                </div>
              </>
            ) : (
              <div className="text-center py-20">
                <div className="flex justify-center mb-8">
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center shadow-xl">
                    <UserOutlined className="text-5xl text-white" />
                  </div>
                </div>

                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  imageStyle={{ height: 60, marginBottom: 16 }}
                  description={
                    <div className="max-w-lg mx-auto">
                      <Title level={3} className="text-gray-800 mb-4">
                        Chưa có yêu cầu ghép phòng nào
                      </Title>
                      <Text className="text-gray-600 text-base leading-relaxed block mb-8">
                        Hiện tại chưa có yêu cầu tìm roommate nào được đăng.
                      </Text>
                    </div>
                  }
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RoommateRequestPage;
