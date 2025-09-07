import React from "react";
import {
  MailOutlined,
  PhoneOutlined,
  EnvironmentOutlined,
} from "@ant-design/icons";

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Tiêu đề */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Liên hệ với chúng tôi
          </h1>
          <p className="text-lg text-gray-600">
            Nếu bạn có bất kỳ câu hỏi nào, hãy liên hệ hoặc để lại thông tin.
            Chúng tôi sẽ phản hồi sớm nhất!
          </p>
        </div>

        {/* Grid 2 cột */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Bên trái: thông tin + map */}
          <div className="space-y-8">
            {/* Thông tin liên hệ */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Thông tin liên hệ
              </h2>
              <ul className="space-y-5">
                <li className="flex items-center gap-4">
                  <EnvironmentOutlined className="text-blue-600 text-xl" />
                  <span className="text-gray-700">
                    123 Đường Tôn Đức Thắng, Quận 1, TP. HCM
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <PhoneOutlined className="text-blue-600 text-xl" />
                  <span className="text-gray-700">+84 123 456 789</span>
                </li>
                <li className="flex items-center gap-4">
                  <MailOutlined className="text-blue-600 text-xl" />
                  <span className="text-gray-700">support@rentq.com</span>
                </li>
              </ul>
            </div>

            {/* Google Map */}
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <iframe
                title="Google Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5025929290747!2d106.70042347481506!3d10.772029789375998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3a7d61b63d%3A0x95bdf4b77dae1f4f!2zMTIzIMSQxrDhu51uZyBBQkMsIFF14bqtbiAxLCBUUC5IQ00!5e0!3m2!1svi!2s!4v1700000000000!5m2!1svi!2s"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </div>
          </div>

          {/* Bên phải: form liên hệ */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">
              Gửi tin nhắn
            </h2>
            <form className="space-y-5">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Họ và tên
                </label>
                <input
                  type="text"
                  placeholder="Nhập tên của bạn"
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Nhập email của bạn"
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Nội dung
                </label>
                <textarea
                  rows={5}
                  placeholder="Nhập nội dung tin nhắn"
                  className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                />
              </div>
              <button
                type="submit"
                className="cursor-pointer w-full bg-[#0A2E50] hover:bg-[#E07B39] disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:cursor-not-allowed disabled:transform-none"
              >
                Gửi tin nhắn
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
