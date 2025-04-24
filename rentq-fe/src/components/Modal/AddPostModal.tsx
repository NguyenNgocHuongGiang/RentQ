// components/Modal/AddPostModal.tsx
import { Modal, Input } from "antd";
import { useFormik } from "formik";
import * as Yup from "yup";
import { generateAlias } from "../../utils/helpers";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { createNewPost } from "../../store/slice/postSlice";
import { PostsType } from "../../types/types";
import { toast } from "react-toastify";

interface AddPostModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (values: any) => void;
  propertyId: number | null;
}

const AddPostModal = ({
  visible,
  onClose,
  onSubmit,
  propertyId,
}: AddPostModalProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const formik = useFormik({
    initialValues: {
      property_id: propertyId ?? 0,
      title: "",
      price: 0,
      description: "",
      status: "active", // active or inactive
      is_approved: false,
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required("Title is required")
        .min(5, "Title must be at least 5 characters"),
      price: Yup.number()
        .required("Price is required")
        .min(10000, "Price must be at least 10,000")
        .typeError("Price must be a number"),
      description: Yup.string()
        .required("Description is required")
        .min(10, "Description must be at least 10 characters"),
      status: Yup.string().required(),  
      is_approved: Yup.boolean().required(),
    }),
    enableReinitialize: true,
    onSubmit: (values) => {
      const newPost : PostsType = {
        ...values,
        alias: generateAlias(values.title), 
        property_id: propertyId ?? 0,
      };
      dispatch(createNewPost(newPost)).unwrap();
      toast.success("Post created successfully!");
      onSubmit(newPost);
      formik.resetForm();
    },
  });

  const handleOk = () => {
    formik.handleSubmit();
  };

  const handleCancel = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Modal
      title={<h2 className="text-center text-lg uppercase">Add New Post</h2>}
      open={visible}
      onCancel={handleCancel}
      onOk={handleOk}
      okText="Submit"
    >
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-semibold">Title</label>
          <Input
            name="title"
            value={formik.values.title}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.title && formik.errors.title && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.title}
            </div>
          )}
        </div>

        <div>
          <label className="block mb-1 font-semibold">Price</label>
          <Input
            name="price"
            type="number"
            value={formik.values.price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.price && formik.errors.price && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.price}
            </div>
          )}
        </div>

        <div>
          <label className="block mb-1 font-semibold">Description</label>
          <Input.TextArea
            name="description"
            rows={3}
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.description && formik.errors.description && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.description}
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default AddPostModal;
