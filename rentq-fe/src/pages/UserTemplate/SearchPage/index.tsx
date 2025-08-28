import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store";
import { getPostByLocation, getSavePost } from "../../../store/slice/postSlice";
import { PostCardHorizontal } from "../../../components/Card/PostCardHorizontal";
import { FaSearch } from "react-icons/fa";
import { DatePicker, Pagination } from "antd";
import { getLocation } from "../../../store/slice/propertySlice";
import dayjs from "dayjs";
import "dayjs/locale/en";
import { getAuthData } from "../../../utils/helpers";
import { PostsType } from "../../../types/types";

const SearchPage = () => {
  const { searchPost, userSavePost } = useSelector(
    (state: RootState) => state.postReducer
  );
  const { listLocation } = useSelector(
    (state: RootState) => state.propertyReducer
  );
  const location = useLocation();
  const navigate = useNavigate();
  const [searchLocation, setSearchLocation] = useState("");
  const [searchMap, setSearchMap] = useState("");
  const [searchAvailable, setSearchAvailable] = useState("");
  const [filteredLocations, setFilteredLocations] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<dayjs.Dayjs | null>(null);

  const dispatch = useDispatch<AppDispatch>();

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  useEffect(() => {
    dispatch(getLocation()).unwrap();
    dispatch(getSavePost(getAuthData()?.userId)).unwrap();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const date = params.get("available");
    const loc = params.get("location");

    if (date) {
      const d = dayjs(date, "YYYY-MM-DD");
      if (d.isValid()) {
        setSelectedDate(d);
        setSearchAvailable(date);
      }
    }
    if (loc) {
      setSearchLocation(loc);
      setSearchMap(loc);
    }
    dispatch(
      getPostByLocation({
        location: loc || "",
        available: date || "",
        page: currentPage,
        size: postsPerPage,
      })
    );
  }, [location.search]);

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
    <div className="flex max-w-7xl mx-auto my-5 px-4 gap-8">
      <div className="w-3/5 space-y-4">
        {/* Search bar */}
        <div className="bg-white shadow-md rounded-lg p-2 pl-4 flex flex-wrap items-center gap-4 max-w-4xl mx-auto mb-8 mt-4 border border-gray-300">
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
            className="bg-[#483507] cursor-pointer text-white px-4 py-2 rounded-lg hover:bg-[#796a49] text-sm flex items-center space-x-2"
          >
            <FaSearch />
            <span>Tìm kiếm</span>
          </button>
        </div>

        <h1 className="text-md text-gray-800 font-semibold mt-5">
          Have {searchPost?.total} listings in {searchMap}
        </h1>

        {(searchPost?.posts ?? []).map((item) => (
          <PostCardHorizontal
            key={item.post_id}
            item={item}
            isSave={userSavePost.some(
              (saved: PostsType) => saved.post_id === item.post_id
            )}
          />
        ))}

        {searchPost && typeof searchPost.total === "number" && searchPost.total > 0 ? (
          <div className="flex justify-center mt-8">
            <Pagination
              current={currentPage}
              pageSize={postsPerPage}
              total={searchPost.total}
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
        ): (
         <></>
        )}
      </div>

      {/* Map section */}
      <div className="w-2/5">
        <div className="sticky top-22">
          <iframe
            className="w-full h-[600px] rounded-md shadow-md"
            loading="lazy"
            allowFullScreen
            src={`https://www.google.com/maps?q=${encodeURIComponent(
              searchMap
            )}&output=embed`}
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
