import { useNavigate } from "react-router-dom";

const blogPosts = [
  {
    id: 1,
    title: "5 Mẹo Tìm Bạn Ở Ghép Phù Hợp",
    description: "Bạn đang tìm người ở ghép để chia sẻ chi phí? Hãy tham khảo những mẹo này để tìm được bạn cùng phòng lý tưởng.",
    image: "https://visreal.vn/wp-content/uploads/2025/02/high-floor-1-bedroom-for-rent-lumiere-riverside-fully-furnished-1.jpg",
    date: "15/05/2023",
    readTime: "5 phút đọc",
    link: "/blog/5-meo-o-ghep"
  },
  {
    id: 2,
    title: "Kinh Nghiệm Thuê Chung Cư Giá Rẻ Tại TP.HCM",
    description: "Thuê chung cư tại TP.HCM không hề đơn giản, đặc biệt với ngân sách hạn chế. Xem ngay những kinh nghiệm thực tế.",
    image: "https://hanoirealestate.com.vn/images/products/good-quality-1bedroom-apartment-in-the-heart-of-hoan-kiem_2020217114661.jpg",
    date: "10/05/2023",
    readTime: "7 phút đọc",
    link: "/blog/thue-chung-cu"
  },
  {
    id: 3,
    title: "Những Lưu Ý Khi Thuê Trọ Để Tránh Lừa Đảo",
    description: "Lừa đảo trong lĩnh vực thuê trọ ngày càng phổ biến. Đọc ngay bài viết này để biết cách bảo vệ bản thân khi tìm nhà trọ.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBeXGLXWnv2iLv2qHn1bYP4R4XmX0EZa0mi75xVhVY_tETJqLBKRih-oWIipniaIC_WmA&usqp=CAU",
    date: "05/05/2023",
    readTime: "6 phút đọc",
    link: "/blog/thue-tro-an-toan"
  }
];

export default function Blog() {
  const navigate = useNavigate();

  return (
    <div className="blog-container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '40px', color: '#333' }}>
        Blog
      </h1>

      <div className="blog-posts" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '30px'
      }}>
        {blogPosts.map((post) => (
          <div
            key={post.id}
            className="post-card"
            style={{
              border: '1px solid #eee',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              transition: 'transform 0.2s ease-in-out'
            }}
            onClick={() => navigate(post.link)}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            <img
              src={post.image}
              alt={post.title}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '4px',
                marginBottom: '15px'
              }}
            />
            <h2 style={{ fontSize: '1.3rem', marginBottom: '10px', color: '#2c3e50' }}>
              {post.title}
            </h2>
            <p style={{ color: '#666', lineHeight: '1.6', marginBottom: '15px', fontSize: '0.9rem' }}>
              {post.description}
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: '#999'
            }}>
              <span>Đăng ngày: {post.date}</span>
              <span>{post.readTime}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
