import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../store";
import { getActiveRoomFinder } from "../../../store/slice/roomFinderSlice";
import { RoomFinderCard } from "../../../components/Card/RoomFinderCard";
import Loading from "../../../components/Loading";

const RoomFinderPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [listRoomFinder, setListRoomFinder] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Bộ lọc
  const [selectedPlaces, setSelectedPlaces] = useState<string[]>([]);
  const [selectedPriceRange, setSelectedPriceRange] = useState<string[]>([]);

  // Các options bộ lọc
  const placeOptions = ["Quận 1", "Quận 2", "Quận 3", "Quận 4", "Quận 5", "Quận 6", "Quận 7", "Quận 8", "Quận 9", "Quận 10", "Quận 11", "Quận 12", "Tân Bình", "Tân Phú", "Bình Tân", "Bình Thạnh", "Gò Vấp", "Thủ Đức"];
  const priceOptions = [
    { label: "Dưới 2 triệu", value: "0-2000000" },
    { label: "2 - 5 triệu", value: "2000000-5000000" },
    { label: "5 - 10 triệu", value: "5000000-10000000" },
    { label: "Trên 10 triệu", value: "10000000-999999999" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await dispatch(
          getActiveRoomFinder({ page, limit: 10 })
        ).unwrap();

        setListRoomFinder(data.data);
      } catch (err) {
        console.error("Fetch Room Finder error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, page]);

  const filteredList = listRoomFinder.filter((item) => {
    const matchPlace =
      selectedPlaces.length === 0 ||
      selectedPlaces.some((place) =>
        item.preferred_location?.includes(place)
      );

    const matchPrice =
      selectedPriceRange.length === 0 ||
      selectedPriceRange.some((range) => {
        const [min, max] = range.split("-").map(Number);
        return item.budget >= min && item.budget <= max;
      });

    return matchPlace && matchPrice;
  });

  const handlePlaceChange = (place: string) => {
    setSelectedPlaces((prev) =>
      prev.includes(place) ? prev.filter((p) => p !== place) : [...prev, place]
    );
  };

  const handlePriceChange = (value: string) => {
    setSelectedPriceRange((prev) =>
      prev.includes(value)
        ? prev.filter((p) => p !== value)
        : [...prev, value]
    );
  };

  return (
    <div className="max-w-7xl mx-auto py-8 grid grid-cols-12 gap-6">
      {/* Sidebar lọc */}
      <div className="col-span-3 bg-white shadow-md rounded-xl p-4">
        <h2 className="font-semibold text-lg mb-4">Bộ lọc</h2>

        {/* Lọc theo chỗ ở */}
        <div className="mb-6">
          <h3 className="font-medium mb-2">Chỗ ở</h3>
          {placeOptions.map((place) => (
            <label key={place} className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={selectedPlaces.includes(place)}
                onChange={() => handlePlaceChange(place)}
              />
              <span>{place}</span>
            </label>
          ))}
        </div>

        {/* Lọc theo giá */}
        <div>
          <h3 className="font-medium mb-2">Khoảng giá</h3>
          {priceOptions.map((price) => (
            <label key={price.value} className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                checked={selectedPriceRange.includes(price.value)}
                onChange={() => handlePriceChange(price.value)}
              />
              <span>{price.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Danh sách kết quả */}
      <div className="col-span-9">
        {loading ? (
          <Loading />
        ) : (
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-6">
            {filteredList.length > 0 ? (
              filteredList.map((item: any) => (
                <RoomFinderCard key={item.id} item={item} />
              ))
            ) : (
              <p>Không có kết quả phù hợp</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomFinderPage;
