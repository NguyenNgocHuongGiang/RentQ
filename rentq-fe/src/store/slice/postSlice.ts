import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/configApi";
import {
  ActivePostType,
  DefaultState,
  // ListingImageType,
  // ListingsProperty,
  // ReviewProperty,
} from "../../types/types";
import { getAuthData } from "../../utils/helpers";

// export const createNewPost = createAsyncThunk<ListingsProperty>(
//   "posts/createNewPost",
//   async (credentials, { rejectWithValue }) => {
//     try {
//       const response = await api.post(`listings`, credentials);
//       console.log(response.data.content);
//       return response.data.content;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data || "Create failed!");
//     }
//   }
// );

// export const deletePosts = createAsyncThunk<ListingsProperty, number>(
//   "posts/deletePosts",
//   async (listingId, { rejectWithValue }) => {
//     try {
//       const response = await api.delete(`listings/${listingId}`);
//       console.log(response.data.content);
//       return response.data.content;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data || "Xóa thất bại!");
//     }
//   }
// );

export const uploadImages = createAsyncThunk<string[], FileList>(
  "posts/uploadImages",
  async (files, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });

      const response = await api.post(`file-upload/multiple-files`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
      return response.data.content.imageUrls;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Upload failed!");
    }
  }
);

// export const createListingImage = createAsyncThunk<
//   ListingImageType,
//   ListingImageType
// >("posts/createListingImage", async (credentials, { rejectWithValue }) => {
//   try {
//     const response = await api.post(`listing-images`, credentials);
//     console.log(response);
//     return response.data.content;
//   } catch (error: any) {
//     return rejectWithValue(error.response?.data || "Create failed!");
//   }
// });

export const getDetailListings = createAsyncThunk<any, string>(
  "posts/getDetailListings",
  async (alias, { rejectWithValue }) => {
    try {
      const response = await api.get(`listings/detail/${alias}`);
      console.log(response.data.content);
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lấy thông tin thất bại!");
    }
  }
);

// export const getReviewListings = createAsyncThunk<ReviewProperty[], number>(
//   "posts/getReviewListings",
//   async (listingId, { rejectWithValue }) => {
//     try {
//       const response = await api.get(`reviews/${listingId}`);
//       console.log(response.data.content);
//       return response.data.content;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data || "Lấy thông tin thất bại!");
//     }
//   }
// );

// export const createNewReview = createAsyncThunk<ReviewProperty, ReviewProperty>(
//   "posts/createNewReview",
//   async (credentials, { rejectWithValue }) => {
//     try {
//       const response = await api.post(`reviews`, credentials);
//       console.log(response.data.content);
//       return response.data.content;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data || "Create failed!");
//     }
//   }
// );

export const getPopularListings = createAsyncThunk<ActivePostType[]>(
  "posts/getPopularListings",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("posts/active");
      console.log(response.data.content);
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lấy thông tin thất bại!");
    }
  }
);

export const getUserListings = createAsyncThunk<any, number>(
  "posts/getUserListings",
  async (user_id, { rejectWithValue }) => {
    try {
      const response = await api.get(`listings/get-user-listings/${user_id}`);
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lấy thông tin thất bại!");
    }
  }
);

const initialState: DefaultState = {
  loading: false,
  data: null,
  posts: [] as ActivePostType[],
  reviewData: null,
  detailPost: null,
  error: null,
};

const postSlice = createSlice({
  name: "postSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //lay popular listings
    builder.addCase(getPopularListings.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getPopularListings.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(getPopularListings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // lay thong tin listing cua nguoi dung
    builder.addCase(getUserListings.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getUserListings.fulfilled, (state, action) => {
      state.loading = false;
      state.posts = action.payload;
    });
    builder.addCase(getUserListings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    //tao bai dang moi
    // builder.addCase(createNewPost.pending, (state) => {
    //   state.loading = true;
    //   state.error = null;
    // });
    // builder.addCase(createNewPost.fulfilled, (state, action) => {
    //   state.loading = false;
    //   state.posts = [...(state.posts || []), action.payload];
    // });
    // builder.addCase(createNewPost.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload as string;
    // });

    //lay thong tin chi tiet listings
    builder.addCase(getDetailListings.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getDetailListings.fulfilled, (state, action) => {
      state.loading = false;
      state.detailPost = action.payload;
    });
    builder.addCase(getDetailListings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // //lay review listings
    // builder.addCase(getReviewListings.pending, (state) => {
    //   state.loading = true;
    //   state.error = null;
    // });
    // builder.addCase(getReviewListings.fulfilled, (state, action) => {
    //   state.loading = false;
    //   state.reviewData = action.payload;
    // });
    // builder.addCase(getReviewListings.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload as string;
    // });

    // // tao moi review
    // builder.addCase(createNewReview.pending, (state) => {
    //   state.loading = true;
    //   state.error = null;
    // });
    // builder.addCase(createNewReview.fulfilled, (state, action) => {
    //   state.loading = false;
    //   const userInfo = getAuthData();
    //   const newReview = {
    //     ...action.payload,
    //     users: {
    //       full_name: userInfo?.userName,
    //       avatar_url: userInfo?.avatar,
    //     },
    //   };
    //   state.reviewData = [...(state.reviewData || []), newReview];
    // });
    // builder.addCase(createNewReview.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload as string;
    // });

    //xoa bai dang
    // builder.addCase(deletePosts.pending, (state) => {
    //   state.loading = true;
    //   state.error = null;
    // });
    // builder.addCase(deletePosts.fulfilled, (state, action) => {
    //   state.loading = false;
    //   const deletedId = action.payload.listing_id;
    //   state.listings = (state.listings ?? []).filter(
    //     (item: ListingsProperty) => item.listing_id !== deletedId
    //   );
    // });
    // builder.addCase(deletePosts.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload as string;
    // });
  },
});

export default postSlice.reducer;
