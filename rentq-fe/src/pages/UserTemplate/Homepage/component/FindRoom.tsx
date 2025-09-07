import { useEffect, useState } from "react"
import { AppDispatch } from "../../../../store";
import { useDispatch } from "react-redux";
import { getActiveRoomFinder } from "../../../../store/slice/roomFinderSlice";
import { RoomFinderCard } from "../../../../components/Card/RoomFinderCard";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

const FindRoom = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [listRoomFinder, setListRoomFinder] = useState([])
    const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await dispatch(
          getActiveRoomFinder({ page: 1, limit: 3 })
        ).unwrap(); 
        setListRoomFinder(data.data || []);
      } catch (err) {
        console.error("Fetch room finder failed:", err);
      }
    };

    fetchData();
  }, [dispatch]);

    return (
        <div className="max-w-7xl mx-auto lg:mb-16 mb-8">
            <div className="flex justify-between items-center mb-8 mt-5 text-[#0A2E50]">
                    <h2 className="text-3xl font-bold">Bài viết tìm phòng mới</h2>
                    <p
                      className="group flex items-center gap-1 text-[#0A2E50] cursor-pointer transition duration-300"
                      onClick={() => navigate("/tim-tro")}
                    >
                      <span className="group-hover:underline">Xem thêm</span>
                      <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                    </p>
                  </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 md:gap-6 gap-4 ">
                {
                    listRoomFinder?.map((item: any) => (
                        <RoomFinderCard key={item.id} item={item} />
                    ))
                }
            </div>
        </div>
    )
}

export default FindRoom