import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/configApi";
import {
  DefaultState,
  PropertyImage,
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

export const getTenantProperties = createAsyncThunk<PropertyType[], number>(
  "property/getTenantProperties",
  async (user_id, { rejectWithValue }) => {
    try {
      const response = await api.get(`properties/tenant-properties/${user_id}`);
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

export const createPropertyImage = createAsyncThunk<PropertyImageType, any>(
  "property/createPropertyImage",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post(`property-images`, credentials);
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Create failed!");
    }
  }
);

export const getPropertiesImages = createAsyncThunk<PropertyImage[], number>(
  "property/getPropertiesImages",
  async (propertyId, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `property-images/get-by-propertyId/${propertyId}`
      );
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lấy thông tin thất bại!");
    }
  }
);

export const editProperty = createAsyncThunk<PropertyType, PropertyType>(
  "property/editProperty",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.put(
        `properties/${credentials.property_id}`,
        credentials
      );
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Create failed!");
    }
  }
);

export const editPropertyImage = createAsyncThunk<
  PropertyImage,
  { url: string; status: boolean }
>("property/editPropertyImage", async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.put(`property-images`, credentials);
    return response.data.content;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Create failed!");
  }
});

export const deletePropertyImages = createAsyncThunk<
  PropertyImage,
  { url: string }
>("property/deletePropertyImages", async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.delete(`property-images`, {
      data: credentials,
    });
    console.log(response.data.content);
    return response.data.content;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Xóa thất bại!");
  }
});

export const deleteProperty = createAsyncThunk<PropertyType, number>(
  "property/deleteProperty",
  async (propertyId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`properties/${propertyId}`);
      console.log(response.data.content);
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Xóa thất bại!");
    }
  }
);

const initialState: DefaultState = {
  loading: false,
  listProperties: null,
  listLocation: [],
  listPropertyImages: [],
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
      })

      //
      .addCase(getPropertiesImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPropertiesImages.fulfilled, (state, action) => {
        state.loading = false;
        state.listPropertyImages = action.payload;
      })
      .addCase(getPropertiesImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      })

      //
      .addCase(editProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.listProperties = state.listProperties?.map(
          (property: PropertyType) => {
            if (property.property_id === action.payload.property_id) {
              return { ...property, ...action.payload };
            }
            return property;
          }
        );
      })
      .addCase(editProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      })

      //
      .addCase(deletePropertyImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePropertyImages.fulfilled, (state, action) => {
        state.loading = false;
        state.listPropertyImages = (state.listPropertyImages ?? []).filter(
          (image: PropertyImage) => image.image_id !== action.payload.image_id
        );
      })
      .addCase(deletePropertyImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      })

      //
      .addCase(editPropertyImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editPropertyImage.fulfilled, (state, action) => {
        state.loading = false;

        // Cập nhật lại listProperties với thông tin ảnh mới
        const updatedProperty = action.payload;

        // Tìm property cần cập nhật trong listProperties
        const propertyIndex = state.listProperties.findIndex(
          (property: PropertyType) =>
            property.property_id === updatedProperty.property_id
        );

        // Nếu tìm thấy property, tiến hành cập nhật thông tin ảnh của nó
        if (propertyIndex !== -1) {
          state.listProperties[propertyIndex] = {
            ...state.listProperties[propertyIndex],
            property_images: updatedProperty,
          };
        }
      })

      .addCase(editPropertyImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      })

      //
      .addCase(deleteProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProperty.fulfilled, (state, action) => {
        state.loading = false;
        state.listProperties = (state.listProperties ?? []).filter(
          (property: PropertyType) =>
            property.property_id !== action.payload.property_id
        );
      })
      .addCase(deleteProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      });
  },
});

export default propertySlice.reducer;
