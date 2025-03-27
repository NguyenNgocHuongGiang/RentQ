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
  return (
    <div className="z-50 text-left fixed inset-0 flex items-center justify-center bg-amber-50/5 backdrop-blur-sm text-[#483507]">
    <div className="max-h-120 overflow-y-auto text-md bg-white p-6 rounded-lg shadow-2xl shadow-black/50 transform transition-all scale-95 animate-fade-in">
      <h2 className="text-2xl font-semibold">
        Rental Registration Policy
      </h2>
      <p className="mt-2">
        Before proceeding, you must agree to the following terms and
        conditions:
      </p>
      <ul className="list-disc list-inside mt-3 space-y-2">
        <li>
          All rental properties must be legally owned and have valid
          documentation.
        </li>
        <li>
          All information provided by the landlord must be accurate and
          up-to-date.
        </li>
        <li>
          The landlord is responsible for ensuring the safety and
          usability of the property.
        </li>
        <li>
          Both landlords and tenants must comply with platform policies
          and local laws.
        </li>
        <li>
          Properties must be maintained in good condition before and after
          rental.
        </li>
        <li>
          Respect the privacy and personal rights of all tenants and
          landlords.
        </li>
        <li>
          All financial transactions must be conducted securely and
          transparently.
        </li>
        <li>
          It is strictly prohibited to use rental properties for any
          illegal activities.
        </li>
        <li>
          Any required deposits must be clearly stated before confirming
          the rental.
        </li>
        <li>
          Tenants must follow the agreed-upon rental period without
          unauthorized extensions.
        </li>
        <li>
          Any damages caused by tenants must be reported immediately and
          compensated accordingly.
        </li>
        <li>
          Landlords must provide necessary support and maintenance when
          required.
        </li>
        <li>
          Discrimination based on race, gender, religion, or other factors
          is strictly prohibited.
        </li>
        <li>
          If pets are allowed, the pet policy should be clearly defined to
          prevent conflicts.
        </li>
        <li>
          Noise levels must be kept at reasonable limits to avoid
          disturbing neighbors.
        </li>
        <li>
          Tenants must return the property in its original condition upon
          lease termination.
        </li>
        <li>
          Any disputes between landlords and tenants should be resolved
          amicably or through legal means.
        </li>
      </ul>
      <div className="flex items-center mt-4">
        <input
          onChange={(e) => {
            const isChecked = e.target.checked;
            setAgreed(isChecked);
          }}
          type="checkbox"
          id="agree"
          checked={agreed}
          className="mr-2"
        />
        <label htmlFor="agree" className="text-sm">
          I agree to the policy
        </label>
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
  )
}

export default PolicyModal