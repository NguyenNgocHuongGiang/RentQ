import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/configApi";
import {
  DefaultState,
  ListingImageType,
  ListingsProperty,
} from "../../types/types";

export const createNewPost = createAsyncThunk<ListingsProperty>(
  "user/createNewPost",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post(`listings`, credentials);
      console.log(response.data.content);
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Create failed!");
    }
  }
);

export const uploadImages = createAsyncThunk<string[], FileList>(
  "user/uploadImages",
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

export const createListingImage = createAsyncThunk<
  ListingImageType,
  ListingImageType
>("user/createListingImage", async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post(`listing-images`, credentials);
    console.log(response);
    return response.data.content;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Create failed!");
  }
});

export const getDetailListings = createAsyncThunk<any, string>(
  "user/getDetailListings",
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

const initialState: DefaultState = {
  loading: false,
  data: null,
  error: null,
};

const postSlice = createSlice({
  name: "postSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    //tao bai dang moi
    builder.addCase(createNewPost.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createNewPost.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(createNewPost.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    //lay thong tin chi tiet listings
    builder.addCase(getDetailListings.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getDetailListings.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(getDetailListings.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default postSlice.reducer;
