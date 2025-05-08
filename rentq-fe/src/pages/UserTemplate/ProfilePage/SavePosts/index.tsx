import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "../../../../store"
import { useEffect } from "react"
import { getSavePost } from "../../../../store/slice/postSlice"
import { getAuthData } from "../../../../utils/helpers"
import PostCard from "../../../../components/Card/PostCard"
import { ActivePostType } from "../../../../types/types"

const Posts = () => {
  const {userSavePost} = useSelector((state: RootState) => state.postReducer)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(getSavePost(getAuthData()?.userId)).unwrap()
  },[])

  return (
    <div className="max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-6 gap-4">
        {userSavePost?.length > 0 ? (
          userSavePost.map((post: any) => (
            <PostCard
              key={post.post_id}
              post={post?.posts}
              savedPosts={userSavePost.map((savedPost: ActivePostType) => savedPost.post_id)}
            />
          ))
        ) : (
          <p>No saved posts found.</p>
        )}
    </div>
    </div>
  )
}

export default Posts