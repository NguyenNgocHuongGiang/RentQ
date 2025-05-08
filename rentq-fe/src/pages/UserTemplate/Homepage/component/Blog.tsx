import { useNavigate } from "react-router-dom";

const blogPosts = [
  {
    id: 1,
    title: "5 Mẹo Tìm Bạn Ở Ghép Phù Hợp",
    description:
      "Bạn đang tìm người ở ghép để chia sẻ chi phí? Hãy tham khảo những mẹo này để tìm được bạn cùng phòng lý tưởng.",
    image:
      "https://visreal.vn/wp-content/uploads/2025/02/high-floor-1-bedroom-for-rent-lumiere-riverside-fully-furnished-1.jpg",
    date: "15/05/2023",
    readTime: "5 phút đọc",
    link: "/blog/5-meo-o-ghep",
  },
  {
    id: 2,
    title: "Kinh Nghiệm Thuê Chung Cư Giá Rẻ Tại TP.HCM",
    description:
      "Thuê chung cư tại TP.HCM không hề đơn giản, đặc biệt với ngân sách hạn chế. Xem ngay những kinh nghiệm thực tế.",
    image:
      "https://hanoirealestate.com.vn/images/products/good-quality-1bedroom-apartment-in-the-heart-of-hoan-kiem_2020217114661.jpg",
    date: "10/05/2023",
    readTime: "7 phút đọc",
    link: "/blog/thue-chung-cu",
  },
  {
    id: 3,
    title: "Những Lưu Ý Khi Thuê Trọ Để Tránh Lừa Đảo",
    description:
      "Lừa đảo trong lĩnh vực thuê trọ ngày càng phổ biến. Đọc ngay bài viết này để biết cách bảo vệ bản thân khi tìm nhà trọ.",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBeXGLXWnv2iLv2qHn1bYP4R4XmX0EZa0mi75xVhVY_tETJqLBKRih-oWIipniaIC_WmA&usqp=CAU",
    date: "05/05/2023",
    readTime: "6 phút đọc",
    link: "/blog/thue-tro-an-toan",
  },
];

export default function Blog() {
  const navigate = useNavigate();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
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
