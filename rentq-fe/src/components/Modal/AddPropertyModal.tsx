import { useState } from "react";
import { Modal, Input, Select, DatePicker, Row, Col, Button, Spin } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import dayjs from "dayjs";
import { FaTimesCircle } from "react-icons/fa";
import { getAuthData } from "../../utils/helpers";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import {
  createNewProperty,
  createPropertyImage,
  uploadImages,
} from "../../store/slice/propertySlice";
import { PropertyType } from "../../types/types";
import { toast } from "react-toastify";
import utilitiesData from "../../data/utilities_data.json";

const { TextArea } = Input;
const { Option } = Select;

interface AddPropertyModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
}

export interface ImageFile {
  id: string;
  file: File;
  name: string;
}

const furnitureOptions = ["full", "basic", "none"] as const;
const propertyTypeOptions = [
  "apartment",
  "house",
  "office",
  "storefront",
] as const;

const AddPropertyModal = ({
  visible,
  onClose,
  onSubmit,
}: AddPropertyModalProps) => {
  const [isNextStep, setIsNextStep] = useState(false);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const [isUploading, setIsUploading] = useState(false);
  const utilitiesList = utilitiesData.map((item) => item.name);
  const [selectedUtilities, setSelectedUtilities] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const formik = useFormik({
    initialValues: {
      street: "",
      district: "",
      city: "",
      area: 0,
      utilities: "",
      max_people: 1,
      furniture: "none" as "full" | "basic" | "none",
      available_from: dayjs().toISOString(),
      property_type: "apartment" as
        | "apartment"
        | "house"
        | "office"
        | "storefront",
      description: "",
    },
    validationSchema: Yup.object({
      street: Yup.string().required("Street is required"),
      district: Yup.string().required("District is required"),
      city: Yup.string().required("City is required"),
      area: Yup.number().min(1).required("Area is required"),
      utilities: Yup.string().required("Utilities required"),
      max_people: Yup.number().min(1).required("Required"),
      furniture: Yup.string().oneOf(furnitureOptions).required("Required"),
      available_from: Yup.string().required("Required"),
      property_type: Yup.string()
        .oneOf(propertyTypeOptions)
        .required("Required"),
    }),
    onSubmit: async (values) => {
      const { street, district, city, ...rest } = values;
      const fullAddress = `${street}, ${district}, ${city}`;
      const finalData: PropertyType = {
        landlord_id: getAuthData().userId,
        address: fullAddress,
        ...rest,
        available_from: dayjs(rest.available_from).toISOString(),
      };
      setIsUploading(true);
      const data = await dispatch(createNewProperty(finalData)).unwrap();
      const uploadedImages = await dispatch(
        uploadImages(convertToFileList(images))
      ).unwrap();
      await dispatch(
        createPropertyImage({
          property_id: data.property_id,
          images_url_list: uploadedImages,
          is_main_list: [true, false],
        })
      );
      onSubmit(finalData);
      formik.resetForm();
      setImages([]);
      setMainImage(null);
      setIsNextStep(false);
      toast.success("Property added successfully!");
    },
  });

  const convertToFileList = (files: ImageFile[]): FileList => {
    const dataTransfer = new DataTransfer();
    files.forEach((imageFile) => dataTransfer.items.add(imageFile.file));
    return dataTransfer.files;
  };

  const handleCancel = () => {
    formik.resetForm();
    setImages([]);
    setMainImage(null);
    setIsNextStep(false);
    onClose();
  };

  const toggleUtility = (utility: string) => {
    setSelectedUtilities((prev) => {
      const newUtilities = prev.includes(utility)
        ? prev.filter((item) => item !== utility)
        : [...prev, utility];
      const utilitiesString = newUtilities.join(";");
      formik.setFieldValue("utilities", utilitiesString);
      return newUtilities;
    });
  };

  const filteredUtilities = utilitiesList.filter((utility) =>
    utility.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const filesArray = Array.from(event.target.files);
      const newImages = filesArray.map((file) => ({
        id: URL.createObjectURL(file),
        file,
        name: file.name,
      }));

      if (images.length + newImages.length > 5) return;

      setImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  const handleRemoveImage = (id: string) => {
    setImages((prevImages) => prevImages.filter((img) => img.id !== id));
    if (mainImage === id) setMainImage(null);
  };

  return (
    <Modal
      title={
        <h2 className="text-center uppercase text-xl">Add new property</h2>
      }
      open={visible}
      onCancel={handleCancel}
      footer={
        isNextStep ? (
          <>
            <Button onClick={() => setIsNextStep(false)}>Back</Button>
            <Button
              type="primary"
              loading={isUploading}
              disabled={isUploading}
              onClick={() => formik.handleSubmit()}
            >
              Add
            </Button>
          </>
        ) : (
          <>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button type="primary" onClick={() => setIsNextStep(true)}>
              Next
            </Button>
          </>
        )
      }
      width={800}
    >
      <Spin spinning={isUploading}>
        <form onSubmit={formik.handleSubmit}>
          {!isNextStep ? (
            <>
              <Row gutter={16}>
                <Col span={8}>
                  <label>Street</label>
                  <Input
                    name="street"
                    placeholder="Enter street"
                    value={formik.values.street}
                    onChange={formik.handleChange}
                  />
                </Col>
                <Col span={8}>
                  <label>District</label>
                  <Input
                    name="district"
                    placeholder="Enter district"
                    value={formik.values.district}
                    onChange={formik.handleChange}
                  />
                </Col>
                <Col span={8}>
                  <label>City</label>
                  <Input
                    placeholder="Enter city"
                    name="city"
                    value={formik.values.city}
                    onChange={formik.handleChange}
                  />
                </Col>
              </Row>

              <Row gutter={16} className="mt-3">
                <Col span={12}>
                  <label>Area (m²)</label>
                  <Input
                    placeholder="Enter area"
                    type="number"
                    name="area"
                    value={formik.values.area}
                    onChange={(e) =>
                      formik.setFieldValue("area", Number(e.target.value))
                    }
                  />
                </Col>
                <Col span={12}>
                  <label>Max People</label>
                  <Input
                    type="number"
                    name="max_people"
                    value={formik.values.max_people}
                    onChange={(e) =>
                      formik.setFieldValue("max_people", Number(e.target.value))
                    }
                  />
                </Col>
              </Row>

              <label className="mt-3 block">Utilities</label>
              <div className="border rounded-lg px-2 flex flex-wrap items-center gap-2 border-gray-300 mt-1.5">
                <div className="flex flex-wrap gap-2 py-2">
                  {selectedUtilities.map((utility) => (
                    <div
                      key={utility}
                      className="px-3 py-1 rounded-md bg-[#483507] text-white text-xs flex items-center gap-1 cursor-pointer"
                      onClick={() => toggleUtility(utility)}
                    >
                      {utility}
                      <span className="text-white text-lg font-bold leading-none">
                        ×
                      </span>
                    </div>
                  ))}
                </div>

                {/* Ô Input để nhập và tìm kiếm */}
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 border-0 outline-none focus:ring-0 focus:border-transparent p-2"
                />
              </div>

              {/* Danh sách utilities để chọn */}
              {searchTerm && (
                <div className="border rounded-lg p-2 mt-2 max-h-40 overflow-y-auto">
                  {filteredUtilities.length > 0 ? (
                    filteredUtilities.map((utility) => (
                      <div
                        key={utility}
                        onClick={() => {
                          toggleUtility(utility);
                          setSearchTerm("");
                        }}
                        className="cursor-pointer p-2 hover:bg-gray-200"
                      >
                        {utility}
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm p-2">
                      Không tìm thấy utilities
                    </p>
                  )}
                </div>
              )}

              <Row gutter={16} className="mt-3">
                <Col span={8}>
                  <label>Furniture</label>
                  <Select
                    value={formik.values.furniture}
                    onChange={(value) =>
                      formik.setFieldValue("furniture", value)
                    }
                    className="w-full"
                  >
                    {furnitureOptions.map((f) => (
                      <Option key={f} value={f}>
                        {f}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col span={8}>
                  <label>Property Type</label>
                  <Select
                    value={formik.values.property_type}
                    onChange={(value) =>
                      formik.setFieldValue("property_type", value)
                    }
                    className="w-full"
                  >
                    {propertyTypeOptions.map((t) => (
                      <Option key={t} value={t}>
                        {t}
                      </Option>
                    ))}
                  </Select>
                </Col>
                <Col span={8}>
                  <label>Available From</label>
                  <DatePicker
                    className="w-full"
                    value={dayjs(formik.values.available_from)}
                    onChange={(date) =>
                      formik.setFieldValue(
                        "available_from",
                        date?.format("YYYY-MM-DD")
                      )
                    }
                  />
                </Col>
              </Row>

              <label className="mt-3 block">Description</label>
              <TextArea
                rows={4}
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
              />
            </>
          ) : (
            <>
              {/* <h3 className="text-lg mb-3">Choosing images</h3> */}
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="mb-3"
              />
              {images.length > 5 && (
                <p className="text-red-500 mb-2">Tối đa 5 ảnh</p>
              )}
              {images.length > 0 && (
                <table className="w-full text-center border">
                  <thead className="border-b h-5">
                    <tr className="bg-gray-100">
                      <th>Image</th>
                      <th>Name</th>
                      <th>Main</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {images.map((img) => (
                      <tr key={img.id} className="border-b">
                        <td>
                          <img
                            src={img.id}
                            alt={img.name}
                            className="w-16 h-16 object-cover mx-auto rounded my-2"
                          />
                        </td>
                        <td>{img.name}</td>
                        <td>
                          <input
                            type="radio"
                            name="mainImage"
                            checked={mainImage === img.id}
                            onChange={() => setMainImage(img.id)}
                          />
                        </td>
                        <td>
                          <div className="flex justify-center items-center">
                            <FaTimesCircle
                              className="text-red-500 cursor-pointer"
                              onClick={() => handleRemoveImage(img.id)}
                              size={18}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </>
          )}
        </form>
      </Spin>
    </Modal>
  );
};

export default AddPropertyModal;
