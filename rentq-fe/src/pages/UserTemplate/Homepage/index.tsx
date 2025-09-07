import { FaDoorOpen, FaGlobe, FaHome, FaUsers } from "react-icons/fa";
import Blog from "./component/Blog";
import Carousel from "./component/Carousel";
import CountUpCard from "./component/CountUpCard";
import RentHouse from "./component/RentHouse";
import FindRoom from "./component/FindRoom";
import Roommate from "./component/Roommate";

export default function HomePage() {
  return (
    <>
      <Carousel />
      <RentHouse />
      <FindRoom />
      <Roommate />
      <div className="bg-[#F0F2F5] py-10 my-10">
        <div className="flex flex-wrap justify-between gap-y-6 gap-x-4 max-w-7xl mx-auto">
          <CountUpCard title="Người dùng" end={1200} icon={<FaUsers />} />
          <CountUpCard title="Tìm được chỗ ở" end={312} icon={<FaHome />} />
          <CountUpCard
            title="Cho thuê được chỗ"
            end={198}
            icon={<FaDoorOpen />}
          />
          <CountUpCard
            title="Tổng lượt truy cập"
            end={12345}
            icon={<FaGlobe />}
          />
        </div>
      </div>

      <Blog />
    </>
  );
}
