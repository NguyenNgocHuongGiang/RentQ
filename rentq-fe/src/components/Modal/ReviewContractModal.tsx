import { Button, Input, Modal } from "antd";
import { useState } from "react";
import SignatureSection from "../../pages/AdminTemplate/Contracts/component/SignatureSection";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { createMessage } from "../../store/slice/messageSlice";
import { getAuthData } from "../../utils/helpers";
import { toast } from "react-toastify";
import { ContractType } from "../../types/types";
// import PDFViewer from "../../pages/UserTemplate/ProfilePage/MyContracts/component/PDFReview";
import { editContract } from "../../store/slice/contractSlice";

const ReviewContractModal = ({
  open,
  onClose,
  contract,
}: {
  open: boolean;
  onClose: () => void;
  contract: ContractType;
}) => {
  const [action, setAction] = useState<"accept" | "reject" | "none" | "view">(
    "none"
  );
  const [reason, setReason] = useState("");
  const dispatch = useDispatch<AppDispatch>();
  // const [savedSignature, setSavedSignature] = useState<string>("");

  const handleAcceptedContract = async () => {
    if (!contract.contract_id) return;

    const dataUpdate : ContractType = {
      contract_id: contract.contract_id,
      landlord_id: contract.landlord_id,
      property_id: contract.property_id,
      deposit: contract.deposit,
      rent: contract.rent,
      start_date: contract.start_date,
      end_date: contract.end_date,
      actual_move_in_date: contract.actual_move_in_date,
      status: "active",
      contract_file_url: contract.contract_file_url,
      terms_and_conditions: contract.terms_and_conditions,
    };

    try {
      await dispatch(
        editContract(dataUpdate)
      ).unwrap();

      toast.success("Contract has been accepted and activated!");
      onClose();
    } catch (error: any) {
      toast.error("Failed to update contract: " + error.message);
    }
  };

  const handleSaveSignature = (signature: string) => {
    if (signature) {
      handleAcceptedContract();
    }
  };

  const handleGiveReason = () => {
    if (reason.trim()) {
      handleMessage(reason);
    }
    setReason("");
    setAction("none");
    onClose();
  };

  const handleMessage = async (message: string) => {
    if (contract.landlord_id && contract.contract_file_url?.trim()) {
      const sender_id = getAuthData()?.userId;
      const receiver_id = contract.landlord_id;

      const newMessage1 = {
        sender_id,
        receiver_id,
        content: contract.contract_file_url,
      };
      const newMessage2 = {
        sender_id,
        receiver_id,
        content: message,
      };

      try {
        await dispatch(createMessage(newMessage1)).unwrap();
        await dispatch(createMessage(newMessage2)).unwrap();
        toast.success("Reason sent successfully!");
      } catch (error: any) {
        toast.error("Failed to send message: " + error.message);
      }
    }
  };

  return (
    <Modal
      title=<p className="pt-9 pl-10">Are you accepted with this contracts?</p>
      open={open}
      onCancel={() => {
        setAction("none");
        onClose();
      }}
      footer={null}
      centered
    >
      {action === "none" ? (
        <div className="flex flex-col gap-3 px-10 py-2">
          <Button
            className="!bg-green-100 !text-green-800 !hover:bg-green-200 "
            onClick={() => setAction("accept")}
          >
            Accept
          </Button>

          <Button
            className="!bg-yellow-100 !text-yellow-800 !hover:bg-blue-200 !mb-9"
            onClick={() => setAction("reject")}
          >
            Reject
          </Button>
        </div>
      ) : action === "accept" ? (
        <div className="mb-9">
          <p className="pl-10 pb-5">
            Upload your contract and sign below if you accept the contract
          </p>
          <div className="flex flex-col justify-center items-center gap-5">
            <SignatureSection onSave={handleSaveSignature} />
          </div>
        </div>
      ) : (
        <div className="flex flex-col px-10 py-2">
          <Input.TextArea
            placeholder="Reason you rejected this contract..."
            rows={4}
            name="reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />

          <div className="flex justify-end mt-2 mb-9">
            <Button type="primary" onClick={handleGiveReason}>
              Send
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ReviewContractModal;
