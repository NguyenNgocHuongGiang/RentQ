import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/configApi";
import {
  DefaultState,
  PropertyImageType,
  PropertyType,
} from "../../types/types";

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
      return response.data.content.imageUrls;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Upload failed!");
    }
  }
);

export const createNewProperty = createAsyncThunk<PropertyType, PropertyType>(
  "property/createNewProperty",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post(`properties`, credentials);
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Create failed!");
    }
  }
);

export const getUserProperties = createAsyncThunk<any, number>(
  "property/getUserProperties",
  async (user_id, { rejectWithValue }) => {
    try {
      const response = await api.get(`properties/${user_id}`);
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lấy thông tin thất bại!");
    }
  }
);

export const getLocation = createAsyncThunk<string[]>(
  "property/getLocation",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("properties/location");
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lấy thông tin thất bại!");
    }
  }
);

export const createPropertyImage = createAsyncThunk<
  PropertyImageType,
  any
>("property/createPropertyImage", async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post(`property-images`, credentials);
    return response.data.content;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Create failed!");
  }
});

const initialState: DefaultState = {
  loading: false,
  listProperties: null,
  listLocation: [],
  error: null,
};

const propertySlice = createSlice({
  name: "propertySlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getUserProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.listProperties = action.payload;
      })
      .addCase(getUserProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      })

      //
      .addCase(getLocation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLocation.fulfilled, (state, action) => {
        state.loading = false;
        state.listLocation = action.payload;
      })
      .addCase(getLocation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      })

      // Thêm xử lý cho createNewProperty
      .addCase(createNewProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.listProperties = [action.payload, ...state.listProperties];
      })
      .addCase(createNewProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      });
  },
});

export default propertySlice.reducer;
