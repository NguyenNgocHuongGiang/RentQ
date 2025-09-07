import { useNavigate } from "react-router-dom";

const blogPosts = [
  {
    id: 1,
    title: "Lý do sinh viên rủ nhau săn chung cư 'sang chảnh' ở",
    description:
      "Nếu các chủ phòng trọ nhà trong hẻm không giảm giá, nhiều người sẽ đi thuê chung cư đầy đủ nội thất để ở.",
    image:
      "https://visreal.vn/wp-content/uploads/2025/02/high-floor-1-bedroom-for-rent-lumiere-riverside-fully-furnished-1.jpg",
    date: "15/05/2023",
    readTime: "5 phút đọc",
    link: "https://vnexpress.net/ly-do-sinh-vien-ru-nhau-san-chung-cu-sang-chanh-o-4858124.html",
  },
  {
    id: 2,
    title: "Giá thuê nhà ở xã hội ngang thương mại",
    description:
      "Dù được xây dựng với mục tiêu hỗ trợ người thu nhập thấp, mức giá thuê nhà ở xã hội tại nhiều địa phương lên đến 17 triệu đồng mỗi tháng, ngang nhà thương mại.",
    image:
      "https://hanoirealestate.com.vn/images/products/good-quality-1bedroom-apartment-in-the-heart-of-hoan-kiem_2020217114661.jpg",
    date: "10/05/2023",
    readTime: "7 phút đọc",
    link: "https://vnexpress.net/gia-thue-nha-o-xa-hoi-ngang-thuong-mai-4884747.html",
  },
  {
    id: 3,
    title: "Gánh nặng nhà trọ tăng giá",
    description:
      "TP.HCM - Đột nhiên được thông báo giá trọ tăng gần 20%, kèm nhiều loại phí song dịch vụ, phòng ốc không có gì thay đổi, Thúy Hạnh, 28 tuổi ở Bình Thạnh chật vật đi kiếm chỗ ở mới. ",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBeXGLXWnv2iLv2qHn1bYP4R4XmX0EZa0mi75xVhVY_tETJqLBKRih-oWIipniaIC_WmA&usqp=CAU",
    date: "05/05/2023",
    readTime: "6 phút đọc",
    link: "https://vnexpress.net/ganh-nang-nha-tro-tang-gia-4902521.html",
  },
];

export default function Blog() {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">Blog</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <div
            key={post.id}
            onClick={() => navigate(post.link)}
            className="border border-gray-100 rounded-lg p-5 shadow-md cursor-pointer transform transition-transform hover:scale-105 bg-white"
          >
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-48 object-cover rounded-md mb-4"
            />
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{post.title}</h2>
            <p className="text-sm text-gray-600 mb-4 leading-relaxed">{post.description}</p>
            <div className="flex justify-between text-xs text-gray-400">
              <span>Đăng ngày: {post.date}</span>
              <span>{post.readTime}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
