import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/configApi";
import {
  DefaultState,
  ListingImageType,
  ListingsProperty,
  RoleRequest,
  RoleRequestType,
} from "../../types/types";

export const getInfoUser = createAsyncThunk<any, number>(
  "user/getInfo",
  async (user_id, { rejectWithValue }) => {
    try {
      const response = await api.get(`users/${user_id}`);
      console.log(response.data.content);

      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lấy thông tin thất bại!");
    }
  }
);

export const updateInfoUser = createAsyncThunk<
  any,
  { user_id: number; userData: any }
>("user/updateInfo", async ({ user_id, userData }, { rejectWithValue }) => {
  try {
    const response = await api.put(`users/${user_id}`, userData);
    console.log(response.data.content);

    return response.data.content;
  } catch (error: any) {
    return rejectWithValue(
      error.response?.data || "Cập nhật thông tin thất bại!"
    );
  }
});

export const createRoleRequest = createAsyncThunk<RoleRequest, RoleRequestType>(
  "user/createRoleRequest",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post(`role`, credentials);
      console.log(response.data.content);

      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Send requets failed!");
    }
  }
);

export const getUserRole = createAsyncThunk<any, number>(
  "user/getUserRole",
  async (user_id, { rejectWithValue }) => {
    try {
      const response = await api.get(`role/${user_id}`);
      console.log(response.data.content);
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lấy thông tin thất bại!");
    }
  }
);

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

export const createListingImage = createAsyncThunk<ListingImageType, ListingImageType>(
  "user/createListingImage",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post(`listing-images`, credentials);
      console.log(response);
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Create failed!");
    }
  }
);

export const getUserListings = createAsyncThunk<any, number>(
  "user/getUserListings",
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
  error: null,
};

const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // lay thong tin nguoi dung
    builder.addCase(getInfoUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getInfoUser.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(getInfoUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    //update thong tin nguoi dung
    builder.addCase(updateInfoUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateInfoUser.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(updateInfoUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    //tao yeu cau phan quyen
    builder.addCase(createRoleRequest.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createRoleRequest.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(createRoleRequest.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

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

    //lay thong tin phan quyen
    builder.addCase(getUserRole.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getUserRole.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(getUserRole.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default userSlice.reducer;
