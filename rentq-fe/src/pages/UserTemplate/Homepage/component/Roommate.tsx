import { useEffect, useState } from "react"
import { AppDispatch } from "../../../../store";
import { useDispatch } from "react-redux";
import { getActiveRoommateRequest } from "../../../../store/slice/roomFinderSlice";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { RoommateRequestCard } from "../../../../components/Card/RoommateRequestCard";

const Roommate = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [listRoommate, setListRoommate] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await dispatch(
                    getActiveRoommateRequest({ page: 1, limit: 2 })
                ).unwrap();
                setListRoommate(data.data || []);
            } catch (err) {
                console.error("Fetch room finder failed:", err);
            }
        };

        fetchData();
    }, [dispatch]);

    return (
        <div className="max-w-7xl mx-auto lg:mb-16 mb-8">
            <div className="flex justify-between items-center mb-8 mt-5 text-[#0A2E50]">
                <h2 className="text-3xl font-bold">Kết nối với bạn cùng phòng khác</h2>
                <p
                    className="group flex items-center gap-1 text-[#0A2E50] cursor-pointer transition duration-300"
                    onClick={() => navigate("/o-ghep")}
                >
                    <span className="group-hover:underline">Xem thêm</span>
                    <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </p>
            </div>
            <div className="grid lg:grid-cols-2 grid-cols-1 md:gap-6 gap-4 ">
                {
                    listRoommate?.map((item: any) => (
                        <RoommateRequestCard key={item.id} item={item} />
                    ))
                }
            </div>
        </div>
    )
}

export default Roommate