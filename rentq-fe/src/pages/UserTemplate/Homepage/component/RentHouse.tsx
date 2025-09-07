import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store";
import { ActivePostType } from "../../../../types/types";
import { useEffect, useState } from "react";
import {
  getPopularListings,
  getSavePost,
} from "../../../../store/slice/postSlice";
import PostCard from "../../../../components/Card/PostCard";
import { getAuthData } from "../../../../utils/helpers";
import { DatePicker } from "antd";
import { FaSearch } from "react-icons/fa";
import dayjs from "dayjs";
import { getLocation } from "../../../../store/slice/propertySlice";
import { useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

export default function RentHouse() {
  const { posts, userSavePost } = useSelector(
    (state: RootState) => state.postReducer
  );
  const { listLocation } = useSelector(
    (state: RootState) => state.propertyReducer
  );
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const [location, setLocation] = useState("");
  const [dates, setDates] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [filteredLocations, setFilteredLocations] = useState<string[]>([]); // Danh sách địa điểm lọc

  useEffect(() => {
    dispatch(getPopularListings({ page: 1, limit: 4})).unwrap();
    dispatch(getSavePost(getAuthData()?.userId)).unwrap();
    dispatch(getLocation()).unwrap();
  }, [dispatch]);

  // lọc địa điểm theo input
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocation(value);
    if (value) {
      const filtered = (listLocation ?? []).filter((loc) =>
        loc.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations([]);
    }
  };

  // xử lý chọn địa điểm
  const handleLocationSelect = (selectedLocation: string) => {
    setLocation(selectedLocation);
    setFilteredLocations([]);
  };

  const handleSearch = () => {
    if ((location && location.trim() !== "") || dates) {
      navigate(
        `/search?location=${location}&available=${
          dates ? dates[0].format("YYYY-MM-DD") : ""
        }`
      );
    }
  };

  return (
    <div
      className="max-w-7xl mx-auto lg:mb-16 mb-8"
    >
      {/* Search Bar */}
      <div className="bg-white shadow-md rounded-full px-4 py-4 flex flex-wrap items-center gap-4 max-w-4xl mx-auto my-8 border border-gray-300">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Start your rental search here"
            value={location}
            onChange={handleLocationChange}
            className="w-full px-2 py-1 text-sm outline-none focus:outline-none focus:ring-0 border-none"
          />

          {filteredLocations.length > 0 && (
            <div className="absolute z-10 top-11 left-0 right-0 bg-white border border-gray-300 shadow-md rounded-md mt-1 max-h-48 overflow-y-auto">
              {filteredLocations.map((loc, index) => (
                <div
                  key={index}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => handleLocationSelect(loc)}
                >
                  {loc}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-px bg-gray-300 mx-2 h-8" />

        <DatePicker
          onChange={(date) => setDates([date, date])}
          className="text-sm flex-1 !outline-none !focus:outline-none !focus:ring-0 border-none !border-0 !shadow-none"
        />

        <button
          onClick={handleSearch}
          className="bg-[#E07B39] cursor-pointer text-white px-4 py-2 rounded-full hover:bg-[#796a49] text-sm flex items-center space-x-2"
        >
          <FaSearch />
          <span>Tìm kiếm</span>
        </button>
      </div>

      {/* Post list */}
      <div className="flex justify-between items-center mb-8 mt-10 text-[#0A2E50]">
        <h2 className="text-3xl font-bold">Bài viết cho thuê mới</h2>
        <p
          className="group flex items-center gap-1 text-[#0A2E50] cursor-pointer transition duration-300"
          onClick={() => navigate("/cho-thue")}
        >
          <span className="group-hover:underline">Xem thêm</span>
          <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-6 gap-4">
        {posts?.map((item: ActivePostType) => (
          <PostCard
            key={item.post_id}
            post={item}
            savedPosts={userSavePost?.map(
              (saved: { post_id: number }) => saved.post_id
            )}
          />
        ))}
      </div>
    </div>
  );
}
