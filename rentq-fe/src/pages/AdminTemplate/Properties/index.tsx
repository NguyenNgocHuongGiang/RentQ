import {
  Button,
  Dropdown,
  Input,
  Card,
  Col,
  Row,
  Empty,
  Popover,
  Pagination,
} from "antd";
import { EllipsisOutlined, PlusOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import AddPropertyModal from "../../../components/Modal/AddPropertyModal";
import { AppDispatch } from "../../../store";
import { useDispatch, useSelector } from "react-redux";
import { getAuthData } from "../../../utils/helpers";
import { getUserProperties } from "../../../store/slice/propertySlice";
import AddPostModal from "../../../components/Modal/AddPostModal";
import { getUserPost } from "../../../store/slice/postSlice";
import { useNavigate } from "react-router-dom";

const Properties = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { listProperties } = useSelector((state: any) => state.propertyReducer);
  const { userPost } = useSelector((state: any) => state.postReducer);
  const [isAddPostModalOpen, setIsAddPostModalOpen] = useState(false);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProperties, setFilteredProperties] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const navigate = useNavigate();

  const renderDropdownItems = (propertyId: number) => [
    {
      key: "1",
      label: "Add Post",
      onClick: () => {
        setSelectedPropertyId(propertyId);
        setIsAddPostModalOpen(true);
      },
    },
    {
      key: "2",
      label: "Add Bill",
      onClick: () => console.log("Add Bill for property", propertyId),
    },
    {
      key: "3",
      label: "Edit property",
      onClick: () => console.log("Edit property", propertyId),
    },
  ];

  useEffect(() => {
    dispatch(getUserProperties(getAuthData()?.userId)).unwrap();
  }, []);

  useEffect(() => {
    dispatch(getUserPost(getAuthData()?.userId)).unwrap();
  }, [dispatch]);

  useEffect(() => {
    if (listProperties) {
      const filtered = listProperties.filter((property: any) =>
        property.address?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProperties(filtered);
      setCurrentPage(1); // reset page khi search
    }
  }, [listProperties, searchTerm]);

  const handleModalSubmit = () => {
    setIsModalOpen(false);
    dispatch(getUserProperties(getAuthData()?.userId)).unwrap();
  };

  const paginatedProperties = filteredProperties.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div style={{ padding: "1rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "1rem",
        }}
      >
        <Input.Search
          placeholder="Search properties"
          allowClear
          style={{ maxWidth: 300 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <Button
          className="!bg-[#483507] !text-white !hover:bg-[#c2bdb5] !hover:text-[#483507] !border-none"
          icon={<PlusOutlined />}
          onClick={() => setIsModalOpen(true)}
        >
          Add Property
        </Button>
      </div>

      {/* Modals */}
      <AddPropertyModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
      />

      <AddPostModal
        visible={isAddPostModalOpen}
        onClose={() => setIsAddPostModalOpen(false)}
        onSubmit={() => setIsAddPostModalOpen(false)}
        propertyId={selectedPropertyId}
      />

      {/* List of properties */}
      <Row gutter={[16, 16]}>
        {paginatedProperties && paginatedProperties.length > 0 ? (
          paginatedProperties.map((property: any) => {
            const propertyPosts = userPost?.filter(
              (post: any) => post.property_id === property.property_id
            );

            const popoverContent =
              propertyPosts?.length > 0 ? (
                <div>
                  {propertyPosts.map((post: any, index: number) => (
                    <div key={post.id}>
                      <div
                        className={`py-2 cursor-pointer hover:bg-[#48340757] hover:px-2 transition-all duration-300 ${
                          post.is_approved ? "bg-green-100" : ""
                        }`}
                        onClick={() => navigate(`/detailpost/${post.alias}`)}
                      >
                        <div className="font-semibold">{post.title}</div>
                        <div className="text-xs text-gray-500">
                          Price: {post.price}
                        </div>
                      </div>
                      {index < propertyPosts.length - 1 && (
                        <hr className="border-gray-300" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div>No posts</div>
              );

            return (
              <Col xs={24} sm={12} md={8} lg={6} key={property.id}>
                <Card
                  title={property.name}
                  className="shadow-md hover:shadow-lg cursor-pointer transition-shadow duration-300"
                >
                  <div className="relative">
                    <img
                      src={
                        property?.property_images?.find(
                          (item: any) => item.is_main
                        )?.image_url || "https://via.placeholder.com/150"
                      }
                      alt={property.name}
                      style={{
                        width: "100%",
                        height: 150,
                        objectFit: "cover",
                      }}
                    />
                    <Dropdown
                      menu={{
                        items: renderDropdownItems(property.property_id),
                      }}
                      trigger={["click"]}
                    >
                      <EllipsisOutlined className="absolute top-2 right-2 text-white text-xl cursor-pointer bg-white/50 rounded-full p-1" />
                    </Dropdown>
                  </div>

                  <p className="mt-4 font-semibold">
                    {property?.address || "No description"}
                  </p>

                  <div className="mt-2">
                    <Popover
                      content={popoverContent}
                      title="Posts"
                      placement="top"
                      trigger="hover"
                    >
                      <span
                        className={`cursor-pointer hover:underline ${
                          propertyPosts?.length > 0
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        View Posts
                      </span>
                    </Popover>
                  </div>
                </Card>
              </Col>
            );
          })
        ) : (
          <Col span={24}>
            <Empty description="No properties found" />
          </Col>
        )}
      </Row>

      {filteredProperties.length > pageSize && (
        <div className="mt-6 text-center">
          <Pagination
            current={currentPage}
            pageSize={pageSize}
            total={filteredProperties.length}
            onChange={(page) => setCurrentPage(page)}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
};

export default Properties;
