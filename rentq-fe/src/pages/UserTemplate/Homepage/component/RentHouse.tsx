import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store";
import { ListingsProperty } from "../../../../types/types";
import { useEffect } from "react";
import { getPopularListings } from "../../../../store/slice/postSlice";
import PostCard from "../../../../components/Card/PostCard";

export default function RentHouse() {
  const {data} = useSelector((state: RootState) => state.postReducer)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(getPopularListings()).unwrap()
  },[dispatch])

  console.log(data);
  

  return (
    <div className="container mx-auto p-4" style={{ maxWidth: '1200px'}}>
      <h2 className="text-2xl font-bold mb-4">Danh sách nhà cho thuê</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-6 gap-4">
        {data?.map((item : ListingsProperty) => (
          <PostCard listing={item} />
        ))}
      </div>
    </div>
  );
}
