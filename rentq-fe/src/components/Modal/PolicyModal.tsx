import { useEffect, useState } from "react";
import { Modal, Checkbox } from "antd";
import policyData from "./../../data/policy.json";

const PolicyModal = ({
  setIsOpen,
  agreed,
  setAgreed,
  handleSubmit,
}: {
  setIsOpen: (isOpen: boolean) => void;
  agreed: boolean;
  setAgreed: (agreed: boolean) => void;
  handleSubmit: () => void;
}) => {
  const [policies, setPolicies] = useState<string[]>([]);

  useEffect(() => {
    setPolicies(policyData);
  }, []);

  return (
    <Modal
      title={
        <div className="text-[#483507] text-xl font-semibold uppercase text-center mt-2 mb-4">
          Rental Registration Policy
        </div>
      }
      open={true}
      onCancel={() => setIsOpen(false)}
      onOk={handleSubmit}
      okText="Register"
      cancelText="Cancel"
      width={600}
      okButtonProps={{
        disabled: !agreed,
        type: "default",
        style: agreed
          ? { backgroundColor: "#483507", color: "white", border: "none" }
          : { backgroundColor: "#ccc", color: "#666", cursor: "not-allowed" },
      }}
    >
      <p className="text-[#483507] mt-2">
        Before proceeding, you must agree to the following terms and conditions:
      </p>
      <ul className="list-disc list-inside mt-3 space-y-2 text-[#6b4e2f]">
        {policies.map((policy, index) => (
          <li key={index}>{policy}</li>
        ))}
      </ul>

      <div className="mt-4">
        <Checkbox
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
        >
          I agree to the policy
        </Checkbox>
      </div>
    </Modal>
  );
};

export default PolicyModal;
