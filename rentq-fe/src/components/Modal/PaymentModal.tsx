import { Modal, Button, Radio, Input } from "antd";
import { useEffect, useState } from "react";
import { BankAccountType, BillType } from "../../types/types";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import { getBankAccountDefault } from "../../store/slice/userSlice";

interface PaymentModalProps {
  visible: boolean;
  bill: BillType | null;
  onClose: () => void;
  onPay: (method: string, note?: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  visible,
  bill,
  onClose,
  onPay,
}) => {
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [note, setNote] = useState("");
  const { listContracts } = useSelector((state: any) => state.constractReducer);

  const landlordId = listContracts?.find((c: any) => c.contract_id === bill?.contract_id)?.landlord_id;
  const dispatch = useDispatch<AppDispatch>()
  const [bankAccount, setBankAccount] = useState<BankAccountType | undefined>(undefined);

  useEffect(() => {
    const fetchBankAccount = async () => {
      if (landlordId) {
        try {
          const result = await dispatch(getBankAccountDefault(landlordId)).unwrap();
          setBankAccount(result);
        } catch (error) {
          setBankAccount(undefined);
        }
      }
    };
    fetchBankAccount();
  }, [landlordId, dispatch]);

  const handlePay = () => {
    onPay(paymentMethod, note);
    setNote("");
    setPaymentMethod("card");
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
      // title={<h2 className="text-xl font-bold text-[#0A2E50]">Thanh toán hóa đơn</h2>}
      className="rounded-2xl p-4"
    >
      <img src={`https://img.vietqr.io/image/${bankAccount?.bank_code}-${bankAccount?.account_number}-compact2.png?amount=${bill?.total_amount}&addInfo=${bill?.due_date ? `Thanh toán hóa đơn ${new Date(bill.due_date).toLocaleDateString("vi-VN", {
        month: "2-digit",
        year: "numeric",
      })}` : ""}`} alt="" />
    </Modal>
  );
};
