import {
  Modal,
  DatePicker,
  InputNumber,
  Select,
  Input,
  Form,
  Button,
  Table,
} from "antd";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BillType, ContractType } from "../../types/types";
import { FaTrash } from "react-icons/fa";
import { useFormik } from "formik";
import dayjs from "dayjs";
import { AppDispatch } from "../../store";
import { createNewBill } from "../../store/slice/billSlice";

const { Option } = Select;

interface AddBillProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddBillModal({
  isOpen,
  onClose,
}: AddBillProps) {
  const { listContracts } = useSelector((state: any) => state.constractReducer);
  const [items, setItems] = useState<any[]>([]);
  const dispatch = useDispatch<AppDispatch>();

  const formik = useFormik({
    initialValues: {
      contract_id: null,
      bill_date: null,
      due_date: null,
      status: "UNPAID",
    },
    onSubmit: (values) => {
      const total_amount = calcBillTotal();
      const newBill : BillType = {
        ...values,
        bill_date: values.bill_date
          ? dayjs(values.bill_date).format("YYYY-MM-DD")
          : null,
        due_date: values.due_date
          ? dayjs(values.due_date).format("YYYY-MM-DD")
          : null,
        total_amount,
        status: 'UNPAID',
        bill_items: items.map(({ amount, description, end_number, start_number, item_type, note }) => ({
          amount,
          description,
          end_number : end_number || null,
          start_number : start_number || null,
          item_type,
          total_price: (end_number && start_number) ? (end_number - start_number) * amount : amount,
          note
        })),
      };
      console.log("Save bill:", newBill);
      dispatch(createNewBill(newBill));
      onClose();
    },
  });

  const addItem = () => {
    setItems([
      ...items,
      { key: Date.now(), item_type: "RENT", description: "", amount: 0 },
    ]);
  };

  const removeItem = (key: number) => {
    setItems(items.filter((i) => i.key !== key));
  };

  const calcItemTotal = (record: any) => {
    if (record.start_number != null && record.end_number != null) {
      return (record.end_number - record.start_number) * (record.amount || 0);
    }
    return record.amount || 0;
  };

  const calcBillTotal = () => {
    return items.reduce((sum, i) => sum + calcItemTotal(i), 0);
  };

  const columns = [
    {
      title: "Type",
      dataIndex: "item_type",
      render: (_: any, record: any) => (
        <Select
          value={record.item_type}
          onChange={(val) =>
            setItems((prev) =>
              prev.map((i) =>
                i.key === record.key ? { ...i, item_type: val } : i
              )
            )
          }
          style={{ width: 120 }}
        >
          <Option value="RENT">Rent</Option>
          <Option value="SERVICE">Service</Option>
          <Option value="ELECTRIC">Electric</Option>
          <Option value="WATER">Water</Option>
          <Option value="INTERNET">Internet</Option>
          <Option value="OTHER">Other</Option>
        </Select>
      ),
    },
    {
      title: "Note",
      dataIndex: "note",
      render: (_: any, record: any) =>
        record.item_type === "OTHER" ? (
          <Input
            value={record.note}
            onChange={(e) =>
              setItems((prev) =>
                prev.map((i) =>
                  i.key === record.key ? { ...i, note: e.target.value } : i
                )
              )
            }
            placeholder="Enter note"
          />
        ) : null,
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (_: any, record: any) => (
        <Input
          value={record.description}
          onChange={(e) =>
            setItems((prev) =>
              prev.map((i) =>
                i.key === record.key ? { ...i, description: e.target.value } : i
              )
            )
          }
        />
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (_: any, record: any) => (
        <InputNumber
          value={record.amount}
          onChange={(val) =>
            setItems((prev) =>
              prev.map((i) =>
                i.key === record.key ? { ...i, amount: val } : i
              )
            )
          }
        />
      ),
    },
    {
      title: "Start",
      dataIndex: "start_number",
      render: (_: any, record: any) => (
        <InputNumber
          value={record.start_number}
          onChange={(val) =>
            setItems((prev) =>
              prev.map((i) =>
                i.key === record.key ? { ...i, start_number: val } : i
              )
            )
          }
        />
      ),
    },
    {
      title: "End",
      dataIndex: "end_number",
      render: (_: any, record: any) => (
        <InputNumber
          value={record.end_number}
          onChange={(val) =>
            setItems((prev) =>
              prev.map((i) =>
                i.key === record.key ? { ...i, end_number: val } : i
              )
            )
          }
        />
      ),
    },
    {
      title: "Total",
      dataIndex: "total_price",
      render: (_: any, record: any) => calcItemTotal(record).toFixed(2),
    },
    {
      title: "Action",
      render: (_: any, record: any) => (
        <Button danger onClick={() => removeItem(record.key)}>
          <FaTrash />
        </Button>
      ),
    },
  ];

  return (
    <Modal
      title={<h2 className="text-center uppercase text-xl">Add new bill</h2>}
      open={isOpen}
      onOk={formik.submitForm}
      onCancel={onClose}
      width={800}
      style={{ top: 50 }}
    >
      <Form layout="vertical">
        {/* Contract */}
        <Form.Item label="Property">
          <Select
            placeholder="Select property"
            style={{ width: "100%" }}
            value={formik.values.contract_id || undefined}
            onChange={(val) => formik.setFieldValue("contract_id", val)}
          >
            {listContracts?.map((c: ContractType) => (
              <Option key={c.contract_id} value={c.contract_id}>
                {c.properties?.address}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <div className="flex gap-4">
          <Form.Item label="Bill Date" className="flex-1">
            <DatePicker
              style={{ width: "100%" }}
              value={
                formik.values.bill_date ? dayjs(formik.values.bill_date) : null
              }
              onChange={(val) => formik.setFieldValue("bill_date", val)}
            />
          </Form.Item>
          <Form.Item label="Due Date" className="flex-1">
            <DatePicker
              style={{ width: "100%" }}
              value={
                formik.values.due_date ? dayjs(formik.values.due_date) : null
              }
              onChange={(val) => formik.setFieldValue("due_date", val)}
            />
          </Form.Item>
        </div>

        <Form.Item label="Status">
          <Select
            value={formik.values.status}
            onChange={(val) => formik.setFieldValue("status", val)}
          >
            <Option value="UNPAID">Unpaid</Option>
            <Option value="PAID">Paid</Option>
            <Option value="CANCELLED">Cancelled</Option>
          </Select>
        </Form.Item>

        <h3 className="mt-4 mb-2 font-semibold">Bill Items</h3>
        <Button type="dashed" onClick={addItem} style={{ marginBottom: 10 }}>
          + Add Item
        </Button>
        <Table
          columns={columns}
          dataSource={items}
          pagination={false}
          rowKey="key"
          size="small"
          bordered
          summary={() => (
            <Table.Summary.Row>
              <Table.Summary.Cell
                colSpan={6}
                index={0}
                className="font-bold text-right"
              >
                Total Amount
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1} className="font-bold">
                {calcBillTotal().toFixed(2)}
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2} />
            </Table.Summary.Row>
          )}
        />
      </Form>
    </Modal>
  );
}
