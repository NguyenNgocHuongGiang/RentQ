import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store";
import { ActivePostType } from "../../../../types/types";
import { useEffect } from "react";
import { getPopularListings, getSavePost } from "../../../../store/slice/postSlice";
import PostCard from "../../../../components/Card/PostCard";
import { getAuthData } from "../../../../utils/helpers";

export default function RentHouse() {
  const {posts, userSavePost} = useSelector((state: RootState) => state.postReducer)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(getPopularListings()).unwrap()
    dispatch(getSavePost(getAuthData()?.userId)).unwrap()
  },[dispatch])  

  return (
    <div className="container mx-auto p-4" style={{ maxWidth: '1200px'}}>
      <h2 className="text-2xl font-bold mb-4">Danh sách nhà cho thuê</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 md:gap-6 gap-4">
        {posts?.map((item: ActivePostType) => (
          <PostCard
            key={item.post_id}
            post={item}
            savedPosts={userSavePost?.map((saved: { post_id: number }) => saved.post_id)} 
          />
        ))}
      </div>
    </div>
  );
}
