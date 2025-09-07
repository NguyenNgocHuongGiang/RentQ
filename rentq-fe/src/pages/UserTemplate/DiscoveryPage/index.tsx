"use client";

import { DatePicker, Pagination } from "antd";
import dayjs from "dayjs";
import { useState, useEffect, ChangeEvent } from "react";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom";
import { AppDispatch, RootState } from "../../../store";
import { getLocation } from "../../../store/slice/propertySlice";
import { getPopularListings, getPostByLocation, getSavePost } from "../../../store/slice/postSlice";
import { getAuthData } from "../../../utils/helpers";
import { PostCardProfile } from "../../../components/Card/PostCardProfile";

interface PostType {
  id: number;
  title: string;
  content: string;
}

export default function DiscoveryPage() {

  const { listLocation } = useSelector(
    (state: RootState) => state.propertyReducer
  );
  const { alias } = useParams();

  const { posts, userSavePost } = useSelector(
    (state: RootState) => state.postReducer
  );

  const navigate = useNavigate();
  const [searchLocation, setSearchLocation] = useState("");
  const [searchAvailable, setSearchAvailable] = useState("");
  const [filteredLocations, setFilteredLocations] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;
  const dispatch = useDispatch<AppDispatch>();
  const [selectedPost, setSelectedPost] = useState<any | null>(null);
  const [totalAll, setTotalAll] = useState(0);

  useEffect(() => {
    dispatch(getLocation()).unwrap();
    dispatch(getSavePost(getAuthData()?.userId)).unwrap();
    dispatch(getPopularListings({ page: currentPage, limit: postsPerPage }))
      .unwrap()
      .then(({ total }) => {
        setTotalAll(total);
      })
      .catch((err) => {
        console.error("Error fetching popular listings:", err);
      });
  }, [dispatch, postsPerPage]);


  useEffect(() => {
    if (alias) {
      setSelectedPost(alias);
    } else {
      setSelectedPost(null);
    }
  }, [alias]);

  const handleLocationChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchLocation(value);
    if (value) {
      const filtered = (listLocation ?? []).filter((loc) =>
        loc.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredLocations(filtered);
    } else {
      setFilteredLocations([]);
    }
  };

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    setSelectedDate(date);
    if (date) {
      setSearchAvailable(date.format("YYYY-MM-DD"));
    } else {
      setSearchAvailable("");
    }
    setFilteredLocations([]);
  };

  const handleSearch = () => {
    let query = "/search?";
    if (searchLocation) {
      query += `location=${encodeURIComponent(searchLocation)}`;
    }
    if (searchAvailable) {
      query += `${searchLocation ? "&" : ""}available=${searchAvailable}`;
    }
    navigate(query);
    setFilteredLocations([]);
  };

  return (
    <div className="max-w-7xl mx-auto my-4">
      <div className="bg-white shadow-md rounded-lg p-2  pl-4 flex flex-wrap items-center gap-4 max-w-4xl mx-auto my-8 border border-gray-300">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Start your rental search here"
            value={searchLocation}
            onChange={handleLocationChange}
            className="w-full px-2 py-1 text-sm outline-none focus:outline-none focus:ring-0 border-none"
          />

          {filteredLocations.length > 0 && (
            <div className="absolute z-10 top-11 left-0 right-0 bg-white border border-gray-300 shadow-md rounded-md mt-1 max-h-48 overflow-y-auto">
              {filteredLocations.map((loc, index) => (
                <div
                  key={index}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    setSearchLocation(loc);
                    setFilteredLocations([]);
                  }}
                >
                  {loc}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="w-px bg-gray-300 mx-2 h-8" />

        <DatePicker
          value={selectedDate}
          onChange={handleDateChange}
          className="text-sm flex-1 !outline-none !focus:outline-none !focus:ring-0 border-none !border-0 !shadow-none"
        />
        <button
          onClick={handleSearch}
          className="bg-[#E07B39] cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-[#796a49] text-sm flex items-center space-x-2"
        >
          <FaSearch />
          <span>Tìm kiếm</span>
        </button>
      </div>
      {!selectedPost ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
          {(posts ?? []).map((item) => (
            <div key={item.post_id} onClick={() => setSelectedPost(item)} className="cursor-pointer">
              <PostCardProfile item={item} />
            </div>
          ))}
        </div>
      )
        : (<div className="grid grid-cols-1 md:grid-cols-3">
          <div className="border-r border-gray-300 overflow-y-auto p-4 md:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Danh sách bài viết</h2>

            {(posts ?? []).map((item) => (
              <div key={item.post_id} onClick={() => setSelectedPost(item)} className="cursor-pointer">
                <PostCardProfile item={item} />
              </div>
            ))}

            {posts && typeof totalAll === "number" && totalAll > 0 ? (
              <div className="flex justify-center mt-8">
                <Pagination
                  current={currentPage}
                  pageSize={postsPerPage}
                  total={totalAll}
                  onChange={(page) => {
                    setCurrentPage(page);
                    dispatch(
                      getPostByLocation({
                        location: searchLocation || "",
                        available: searchAvailable || "",
                        page: page,
                        size: postsPerPage,
                      })
                    );
                  }}
                  showSizeChanger={false}
                />
              </div>
            ) : (
              <></>
            )}
          </div>

          {/* Bên phải: chi tiết bài viết */}
          <div className="hidden md:block p-6 md:col-span-2 overflow-y-auto">
            <Outlet context={{ userSavePost }} />
          </div>
        </div>)
      }
    </div>
  );
}
