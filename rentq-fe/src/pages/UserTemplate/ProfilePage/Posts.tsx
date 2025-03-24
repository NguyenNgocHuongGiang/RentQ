import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { FaHome } from "react-icons/fa";

export default function Posts() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const handleSubmit = () => {
    if (agreed) {
      setIsSubmitted(true);
      setIsOpen(false);
    }
  };

  return (
    <div className="p-6rounded-lg text-center">
      <div className="flex flex-col items-center justify-center mt-6">
        <FaHome className="w-24 h-24 text-gray-400 my-8" />
        <h3 className="text-xl font-semibold mb-4 text-[#483507]">
          Are you a landlord looking to rent out your property?
        </h3>
      </div>

      {!isSubmitted ? (
        <button
          onClick={() => setIsOpen(true)}
          className="w-1/4 bg-[#483507] text-white p-3 rounded-lg hover:bg-[#c2bdb5] hover:text-[#483507] hover:font-bold hover:cursor-pointer"
        >
          Send request
        </button>
      ) : (
        <div className="flex flex-col items-center justify-center mt-6">
          <p className="text-gray-600 font-semibold mt-4">
            Yêu cầu đang được phê duyệt...
          </p>
        </div>
      )}

      {/* Modal */}
      <Dialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <div className="bg-white p-6 rounded-lg w-96 shadow-lg">
          <Dialog.Title className="text-lg font-semibold">
            Chính sách cho thuê
          </Dialog.Title>
          <p className="text-gray-600 mt-2">
            Trước khi tiếp tục, bạn cần đồng ý với các điều khoản và chính sách
            của nền tảng.
          </p>
          <div className="flex items-center mt-4">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="agree" className="text-gray-700">
              Tôi đồng ý với chính sách
            </label>
          </div>
          <div className="flex justify-end mt-4 space-x-2">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={!agreed}
              className={`px-4 py-2 rounded-lg ${
                agreed
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-400 text-gray-700 cursor-not-allowed"
              }`}
            >
              Gửi yêu cầu
            </button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
