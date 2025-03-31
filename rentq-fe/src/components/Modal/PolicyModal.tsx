import { useState, useEffect } from "react";
import policyData from "./../../data/policy.json"; // Import JSON file

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
    setPolicies(policyData); // Load policies từ JSON
  }, []);

  return (
    <div className="z-50 text-left fixed inset-0 flex items-center justify-center bg-amber-50/5 backdrop-blur-sm text-[#483507]">
      <div className="max-h-120 overflow-y-auto text-md bg-white p-6 rounded-lg shadow-2xl shadow-black/50 transform transition-all scale-95 animate-fade-in">
        <h2 className="text-2xl font-semibold">Rental Registration Policy</h2>
        <p className="mt-2">
          Before proceeding, you must agree to the following terms and conditions:
        </p>
        <ul className="list-disc list-inside mt-3 space-y-2">
          {policies.map((policy, index) => (
            <li key={index}>{policy}</li>
          ))}
        </ul>

        <div className="flex items-center mt-4">
          <input
            onChange={(e) => setAgreed(e.target.checked)}
            type="checkbox"
            id="agree"
            checked={agreed}
            className="mr-2"
          />
          <label htmlFor="agree" className="text-sm">I agree to the policy</label>
        </div>

        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={() => setIsOpen(false)}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 hover:cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!agreed}
            className={`px-4 py-2 rounded-lg ${
              agreed
                ? "bg-[#483507] text-white hover:bg-[#483507] hover:cursor-pointer"
                : "bg-gray-400 cursor-not-allowed hover:cursor-pointer"
            }`}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
};

export default PolicyModal;
