import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/configApi";
import { DefaultState, RoleRequest, RoleRequestType } from "../../types/types";

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



const initialState: DefaultState = {
  loading: false,
  data: null,
  listings: [],
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
