import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/configApi";
import {
  ActivePostType,
  DefaultState,
  PostsType,
  ReviewProperty,
  SearchPost,
} from "../../types/types";
import { getAuthData } from "../../utils/helpers";

export const createNewPost = createAsyncThunk<PostsType, PostsType>(
  "posts/createNewPost",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post(`posts`, credentials);
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Create failed!");
    }
  }
);

export const addSavePost = createAsyncThunk<
  { user_id: number; post_id: number },
  { user_id: number; post_id: number }
>("posts/addSavePost", async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post(`save-post`, credentials);
    return response.data.content;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Create failed!");
  }
});

export const deleteSavePost = createAsyncThunk<
  any,
  { user_id: number; post_id: number }
>("posts/deleteSavePost", async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.delete(
      `save-post/${credentials.user_id}/${credentials.post_id}`
    );
    return response.data.content;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Create failed!");
  }
});

export const getSavePost = createAsyncThunk<any, number>(
  "posts/getSavePost",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`save-post/${userId}`);
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Create failed!");
    }
  }
);

export const deletePosts = createAsyncThunk<PostsType, number>(
  "posts/deletePosts",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`posts/${postId}`);
      console.log(response.data.content);
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Xóa thất bại!");
    }
  }
);

export const getPostByLocation = createAsyncThunk<
  SearchPost,
  { location: string; available: string; page: number; size: number }
>("posts/getPostByLocation", async (credentials, { rejectWithValue }) => {
  const { location, available, page, size } = credentials;

  try {
    // Tạo query string cho location và available
    const locationQuery = location ? `/${location}` : "/noLocation";
    const availableQuery = available ? `/${available}` : "/noDate";

    // Thêm phân trang vào URL
    const pageQuery = `page=${page}`;
    const sizeQuery = `size=${size}`;

    // Truyền các tham số phân trang vào URL
    const response = await api.get(
      `posts${locationQuery}${availableQuery}?${pageQuery}&${sizeQuery}`
    );

    return response.data.content;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Failed to fetch posts!");
  }
});

export const getDetailPost = createAsyncThunk<PostsType, string>(
  "posts/getDetailListings",
  async (alias, { rejectWithValue }) => {
    try {
      const response = await api.get(`posts/detail-post/${alias}`);
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lấy thông tin thất bại!");
    }
  }
);

export const createNewReview = createAsyncThunk<ReviewProperty, ReviewProperty>(
  "posts/createNewReview",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post(`reviews`, credentials);
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Create failed!");
    }
  }
);

export const updateReview = createAsyncThunk<ReviewProperty, ReviewProperty>(
  "posts/updateReview",
  async (credentials, { rejectWithValue }) => {
    try {
      const { review_id, ...updateData } = credentials;
      const response = await api.patch(`reviews/${review_id}`, updateData);
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Update failed!");
    }
  }
);

export const deleteReview = createAsyncThunk<ReviewProperty, number>(
  "posts/deleteReview",
  async (review_id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`reviews/${review_id}`);
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Xóa thất bại!");
    }
  }
);

export const getReviewProperties = createAsyncThunk<ReviewProperty[], number>(
  "posts/getReviewProperties",
  async (propertyId, { rejectWithValue }) => {
    try {
      const response = await api.get(`reviews/${propertyId}`);
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lấy thông tin thất bại!");
    }
  }
);

export const getPopularListings = createAsyncThunk<
  any, 
  { page: number; limit?: number }
>(
  "posts/getPopularListings",
  async ({ page, limit }, { rejectWithValue }) => {
    try {
      const response = await api.get("posts/active", {
        params: { page, limit }, // truyền query params
      });
      return response.data.content; // tuỳ backend, có thể là response.data.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Lấy thông tin thất bại!"
      );
    }
  }
);


export const getUserPost = createAsyncThunk<any, number>(
  "posts/getUserPost",
  async (user_id, { rejectWithValue }) => {
    try {
      const response = await api.get(`posts/get-user-posts/${user_id}`);
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lấy thông tin thất bại!");
    }
  }
);

const initialState: DefaultState = {
  loading: false,
  userPost: [] as PostsType[],
  userSavePost: [],
  posts: [] as ActivePostType[],
  reviewData: [] as ReviewProperty[],
  detailPost: {} as PostsType,
  searchPost: {} as SearchPost,
  error: null,
};

const postSlice = createSlice({
  name: "postSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createNewPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewPost.fulfilled, (state, action) => {
        state.loading = false;
        state.userPost = [...(state.userPost || []), action.payload];
      })
      .addCase(createNewPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //
      .addCase(getUserPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserPost.fulfilled, (state, action) => {
        state.loading = false;
        state.userPost = action.payload;
      })
      .addCase(getUserPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //
      .addCase(getDetailPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDetailPost.fulfilled, (state, action) => {
        state.loading = false;
        state.detailPost = action.payload;
      })
      .addCase(getDetailPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //
      .addCase(getReviewProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getReviewProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.reviewData = action.payload;
      })
      .addCase(getReviewProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //
      .addCase(createNewReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewReview.fulfilled, (state, action) => {
        state.loading = false;
        const newReview = {
          ...action.payload,
          users: {
            user_id: getAuthData()?.userId,
            full_name: getAuthData()?.userName,
            avatar_url: getAuthData()?.avatar,
          },
        };
        state.reviewData = [newReview, ...state.reviewData];
      })
      .addCase(createNewReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviewData = state.reviewData.map((item: ReviewProperty) =>
          item.review_id === action.payload.review_id
            ? { ...item, ...action.payload }
            : item
        );
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.reviewData = state.reviewData.filter(
          (item: ReviewProperty) => item.review_id !== action.payload.review_id
        );
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //
      .addCase(getPopularListings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPopularListings.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.posts;
      })
      .addCase(getPopularListings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //
      .addCase(getSavePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getSavePost.fulfilled, (state, action) => {
        state.loading = false;
        state.userSavePost = action.payload;
      })
      .addCase(getSavePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //
      .addCase(addSavePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addSavePost.fulfilled, (state, action) => {
        state.loading = false;
        state.userSavePost = [...state.userSavePost, action.payload];
      })
      .addCase(addSavePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //
      .addCase(deleteSavePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSavePost.fulfilled, (state, action) => {
        state.loading = false;
        state.userSavePost = state.userSavePost.filter(
          (item: any) => item.post_id !== action.payload.post_id
        );
      })
      .addCase(deleteSavePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //
      .addCase(getPostByLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPostByLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.searchPost = action.payload;
      })
      .addCase(getPostByLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      //
      .addCase(deletePosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePosts.fulfilled, (state, action) => {
        state.loading = false;
        state.userPost = state.userPost.filter(
          (item: PostsType) => item.post_id !== action.payload.post_id
        );

      })
      .addCase(deletePosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default postSlice.reducer;
