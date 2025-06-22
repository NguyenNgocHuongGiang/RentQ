import { Modal, DatePicker, InputNumber, Select, Input, Form } from "antd";
import { useEffect, useState } from "react";
import { AppDispatch } from "../../store";
import { useDispatch, useSelector } from "react-redux";
import { getUserProperties } from "../../store/slice/propertySlice";
import { getAuthData } from "../../utils/helpers";
import { ContractType, PropertyType } from "../../types/types";
import { useFormik } from "formik";
import * as Yup from "yup";
import moment from "moment";
import {
  createContractTenant,
  createNewContract,
} from "../../store/slice/contractSlice";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";

const { Option } = Select;

interface AddContractProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddContractModal: React.FC<AddContractProps> = ({ isOpen, onClose }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { listProperties, loading } = useSelector(
    (state: any) => state.propertyReducer
  );
  const [step, setStep] = useState(1);

  useEffect(() => {
    dispatch(getUserProperties(getAuthData()?.userId)).unwrap();
  }, []);

  const formik = useFormik({
    initialValues: {
      property_id: "",
      deposit: 0,
      rent: 0,
      start_date: null,
      end_date: null,
      actual_move_in_date: null,
      contract_file_url: "",
      terms_and_conditions: "",
      tenant_email: [""],
    },
    validationSchema: Yup.object({
      property_id: Yup.string().required("Please select a property"),
      deposit: Yup.number()
        .min(1, "Deposit must be greater than 0")
        .required("Please enter deposit amount"),
      rent: Yup.number()
        .min(1, "Rent must be greater than 0")
        .required("Please enter rent amount"),
      start_date: Yup.date().required("Please select start date"),
      end_date: Yup.date().required("Please select end date"),
      actual_move_in_date: Yup.date().required("Please select move-in date"),
      contract_file_url: Yup.string()
        .url("Invalid URL")
        .required("Please enter URL"),
    }),
    onSubmit: async (values) => {
      const { tenant_email, ...restValues } = values;
      const contractData: ContractType = {
        ...restValues,
        property_id: Number(values.property_id),
        landlord_id: getAuthData()?.userId,
        status: "pending",
        start_date: values.start_date ?? "",
        end_date: values.end_date ?? "",
        actual_move_in_date: values.actual_move_in_date ?? "",
      };
      console.log("Submitting contract data:", contractData);
      console.log("email", values.tenant_email);

      await dispatch(createNewContract(contractData))
        .unwrap()
        .then((response) => {
          formik.resetForm();
          dispatch(
            createContractTenant({
              contract_id: response.contract_id ?? 0,
              emailList: values.tenant_email,
            })
          ).unwrap();
          toast.success("Contract created successfully!");
          onClose();
        })
        .catch((error) => {
          console.error("Failed to create contract:", error);
        });
    },
  });

  return (
    <Modal
      title={
        <h2 className="text-center uppercase text-xl">Add new contract</h2>
      }
      open={isOpen}
      onOk={async () => {
        if (step === 1) {
          setStep(2);
          // const errors = await formik.validateForm();
          // if (Object.keys(errors).length === 0) {
          //   setStep(2);
          // } else {
          //   formik.setTouched(
          //     Object.keys(formik.values).reduce((acc, key) => {
          //       acc[key] = true;
          //       return acc;
          //     }, {} as any)
          //   );
          // }
        } else {
          formik.handleSubmit();
        }
      }}
      onCancel={async () => {
        if (step === 1) {
          onClose()
        }else{
          setStep(1);
        }
      }}
      okText={step === 1 ? "Next" : "Save"}
      cancelText={step === 1 ? "Cancel" : "Back"}
      width={650}
      style={{ top: 50 }}
    >
      <Form layout="vertical">
        {step === 1 ? (
          <>
            <div className="flex gap-4">
              <Form.Item
                label="Property"
                validateStatus={
                  formik.errors.property_id && formik.touched.property_id
                    ? "error"
                    : ""
                }
                help={
                  formik.errors.property_id && formik.touched.property_id
                    ? formik.errors.property_id
                    : null
                }
                className="flex-1"
              >
                <Select
                  placeholder="Select a property"
                  loading={loading}
                  allowClear
                  value={formik.values.property_id || undefined}
                  onChange={(value) =>
                    formik.setFieldValue("property_id", value)
                  }
                >
                  {listProperties?.map((prop: PropertyType) => (
                    <Option key={prop.property_id} value={prop.property_id}>
                      {prop.address}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div className="flex gap-4">
              <Form.Item
                label="Deposit (VND)"
                validateStatus={
                  formik.errors.deposit && formik.touched.deposit ? "error" : ""
                }
                help={
                  formik.errors.deposit && formik.touched.deposit
                    ? formik.errors.deposit
                    : null
                }
                className="flex-1"
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Enter deposit amount"
                  value={formik.values.deposit}
                  onChange={(value) => formik.setFieldValue("deposit", value)}
                />
              </Form.Item>

              <Form.Item
                label="Rent (VND)"
                validateStatus={
                  formik.errors.rent && formik.touched.rent ? "error" : ""
                }
                help={
                  formik.errors.rent && formik.touched.rent
                    ? formik.errors.rent
                    : null
                }
                className="flex-1"
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Enter rent amount"
                  value={formik.values.rent}
                  onChange={(value) => formik.setFieldValue("rent", value)}
                />
              </Form.Item>
            </div>

            <div className="flex gap-4">
              <Form.Item
                label="Start Date"
                validateStatus={
                  formik.errors.start_date && formik.touched.start_date
                    ? "error"
                    : ""
                }
                help={
                  formik.errors.start_date && formik.touched.start_date
                    ? formik.errors.start_date
                    : null
                }
                className="flex-1"
              >
                <DatePicker
                  style={{ width: "100%" }}
                  value={
                    formik.values.start_date
                      ? moment(formik.values.start_date)
                      : null
                  }
                  onChange={(date) =>
                    formik.setFieldValue(
                      "start_date",
                      date ? date.toISOString() : null
                    )
                  }
                />
              </Form.Item>

              <Form.Item
                label="End Date"
                validateStatus={
                  formik.errors.end_date && formik.touched.end_date
                    ? "error"
                    : ""
                }
                help={
                  formik.errors.end_date && formik.touched.end_date
                    ? formik.errors.end_date
                    : null
                }
                className="flex-1"
              >
                <DatePicker
                  style={{ width: "100%" }}
                  value={
                    formik.values.end_date
                      ? moment(formik.values.end_date)
                      : null
                  }
                  onChange={(date) =>
                    formik.setFieldValue(
                      "end_date",
                      date ? date.toISOString() : null
                    )
                  }
                />
              </Form.Item>
            </div>

            <div className="flex gap-4">
              <Form.Item
                label="Actual Move-in Date"
                validateStatus={
                  formik.errors.actual_move_in_date &&
                  formik.touched.actual_move_in_date
                    ? "error"
                    : ""
                }
                help={
                  formik.errors.actual_move_in_date &&
                  formik.touched.actual_move_in_date
                    ? formik.errors.actual_move_in_date
                    : null
                }
                className="flex-1"
              >
                <DatePicker
                  style={{ width: "100%" }}
                  value={
                    formik.values.actual_move_in_date
                      ? moment(formik.values.actual_move_in_date)
                      : null
                  }
                  onChange={(date) =>
                    formik.setFieldValue(
                      "actual_move_in_date",
                      date ? date.toISOString() : null
                    )
                  }
                />
              </Form.Item>

              <Form.Item
                label="URL of Contract File"
                validateStatus={
                  formik.errors.contract_file_url &&
                  formik.touched.contract_file_url
                    ? "error"
                    : ""
                }
                help={
                  formik.errors.contract_file_url &&
                  formik.touched.contract_file_url
                    ? formik.errors.contract_file_url
                    : null
                }
                className="flex-1"
              >
                <Input
                  style={{ width: "100%" }}
                  placeholder="https: ........"
                  name="contract_file_url"
                  value={formik.values.contract_file_url}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Form.Item>
            </div>

            <Form.Item label="Terms & Conditions">
              <Input.TextArea
                rows={4}
                placeholder="Enter terms & conditions"
                name="terms_and_conditions"
                value={formik.values.terms_and_conditions}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Form.Item>
            <p style={{ marginTop: "-15px", fontSize: "13px", color: "gray" }}>
              If you have not written a contract yet, you can{" "}
              <a
                href="/contract-template"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#1890ff" }}
              >
                use this contract generator
              </a>
              .
            </p>
          </>
        ) : (
          <Form.Item label="Tenant Emails">
            {formik.values.tenant_email.map((email, index) => (
              <div key={index} className="flex items-center gap-2 mb-2">
                <Input
                  name={`tenant_email[${index}]`}
                  value={email}
                  placeholder="Enter tenant's email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  className="text-red-500 cursor-pointer"
                  onClick={() => {
                    const updated = [...formik.values.tenant_email];
                    updated.splice(index, 1);
                    formik.setFieldValue("tenant_email", updated);
                  }}
                  disabled={formik.values.tenant_email.length === 1}
                >
                  <FaTrash size={20} />
                </button>
              </div>
            ))}
            <button
              type="button"
              className="text-blue-500 mt-2"
              onClick={() =>
                formik.setFieldValue("tenant_email", [
                  ...formik.values.tenant_email,
                  "",
                ])
              }
            >
              + Add another email
            </button>
            <p className="text-sm text-gray-400 mt-2">
              After creating the contract, the tenant who has this email will
              receive an email.
            </p>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
};

export default AddContractModal;
