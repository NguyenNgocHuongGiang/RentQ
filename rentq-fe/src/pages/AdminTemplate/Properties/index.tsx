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
import {
  deleteProperty,
  getUserProperties,
} from "../../../store/slice/propertySlice";
import AddPostModal from "../../../components/Modal/AddPostModal";
import { deletePosts, getUserPost } from "../../../store/slice/postSlice";
import { useNavigate } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import ConfirmModal from "../../../components/Modal/ConfirmModal";
import { PropertyType } from "../../../types/types";
import { toast } from "react-toastify";

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
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isConfirmModalDelProperty, setIsConfirmModalDelProperty] =
    useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [editingProperty, setEditingProperty] = useState<any | null>(null);
  const [editKey, setEditKey] = useState(0);

  const pageSize = 8;

  const navigate = useNavigate();

  const renderDropdownItems = (property: PropertyType) => [
    {
      key: "1",
      label: "Add Post",
      onClick: () => {
        setSelectedPropertyId(property.property_id ?? null);
        setIsAddPostModalOpen(true);
      },
    },
    {
      key: "2",
      label: "Add Bill",
      onClick: () => console.log("Add Bill for property"),
    },
    {
      key: "3",
      label: "Edit property",
      onClick: () => {
        setEditingProperty(property);
        setEditKey(editKey + 1);
        setIsModalOpen(true);
      },
    },
    {
      key: "4",
      label: "Delete property",
      onClick: () => {
        setIsConfirmModalDelProperty(true);
        setSelectedPropertyId(property.property_id ?? null);
      },
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
      setCurrentPage(1);
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

  const handleDeletePost = () => {
    if (selectedPostId) {
      dispatch(deletePosts(selectedPostId)).then(() => {
        setIsConfirmModalOpen(false);
        toast.success('Delete post successfully')
      });
    }
  };

  const handleDeleteProperty = () => {
    if (selectedPropertyId) {
      dispatch(deleteProperty(selectedPropertyId)).then(() => {
        setIsConfirmModalDelProperty(false);
        toast.success('Delete property successfully')
      });
    }
  };

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
        editingProperty={editingProperty}
        editKey={editKey}
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
                <div className="w-[250px] max-h-[300px] overflow-y-auto">
                  {propertyPosts.map((post: any, index: number) => (
                    <div key={post.id}>
                      <div
                        className={`relative py-2 pl-2 pr-6 cursor-pointer hover:bg-[#4834071a] transition-all duration-300 ${
                          post.is_approved ? "bg-green-100" : ""
                        }`}
                        onClick={() => navigate(`/detailpost/${post.alias}`)}
                      >
                        <div className="font-semibold">{post.title}</div>
                        <div className="text-xs text-gray-500">
                          Price: {post.price}
                        </div>

                        <FaTimes
                          className="absolute right-2 top-2 text-gray-400 hover:text-red-500 z-10"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsConfirmModalOpen(true);
                            setSelectedPostId(post.post_id);
                          }}
                        />
                      </div>
                      {index < propertyPosts.length - 1 && (
                        <hr className="border-gray-300" />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-[250px]">No posts</div>
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
                        items: renderDropdownItems(property),
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
                    {!isConfirmModalOpen && (
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
                    )}
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

      <ConfirmModal
        open={isConfirmModalOpen}
        title="Delete Confirmation"
        content={`Are you sure you want to delete the post?`}
        onOk={handleDeletePost}
        onCancel={() => setIsConfirmModalOpen(false)}
        okText="Delete"
        cancelText="Cancel"
      />

      <ConfirmModal
        open={isConfirmModalDelProperty}
        title="Delete Confirmation"
        content={`Are you sure you want to delete the property?`}
        onOk={handleDeleteProperty}
        onCancel={() => setIsConfirmModalDelProperty(false)}
        okText="Delete"
        cancelText="Cancel"
      />

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
