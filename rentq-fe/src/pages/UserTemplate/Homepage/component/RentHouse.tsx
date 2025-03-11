import React from "react";

const houses = [
  {
    id: 1,
    title: "Căn hộ cao cấp Quận 1",
    address: "123 Đường Nguyễn Trãi, Quận 1, TP.HCM",
    price: "15,000,000 VND/tháng",
    image: "https://via.placeholder.com/300",
  },
  {
    id: 2,
    title: "Nhà nguyên căn Bình Thạnh",
    address: "456 Đường Điện Biên Phủ, Bình Thạnh, TP.HCM",
    price: "10,000,000 VND/tháng",
    image: "https://via.placeholder.com/300",
  },
  {
    id: 3,
    title: "Studio hiện đại Quận 7",
    address: "789 Đường Lê Văn Lương, Quận 7, TP.HCM",
    price: "8,000,000 VND/tháng",
    image: "https://via.placeholder.com/300",
  },
];

export default function RentHouse() {
  return (
    <div className="container mx-auto p-4" style={{ maxWidth: '1200px'}}>
      <h2 className="text-2xl font-bold mb-4">Danh sách nhà cho thuê</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {houses.map((house) => (
          <div key={house.id} className="bg-white shadow-md rounded-lg overflow-hidden">
            <img
              src={house.image}
              alt={house.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{house.title}</h3>
              <p className="text-gray-600">{house.address}</p>
              <p className="text-red-500 font-bold mt-2">{house.price}</p>
              <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Xem chi tiết
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
