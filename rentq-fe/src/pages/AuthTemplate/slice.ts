import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/configApi";
import { DefaultState } from "../../types/types";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterCredentials {
  full_name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  role: string;
}

export const loginUser = createAsyncThunk<any, LoginCredentials>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("auth/login", credentials);
      localStorage.setItem("authInfo", JSON.stringify(response.data.content));      
      return response.data.content;
    } catch (error: any) {   
      return rejectWithValue(error.response?.data?.message || "Đăng nhập thất bại!");
    }
  }
);

export const registerUser = createAsyncThunk<any, RegisterCredentials>(
  "auth/register",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("auth/register", credentials);
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Đăng ký thất bại!");
    }
  }
);

const initialState: DefaultState & { registerSuccess: boolean } = {
  loading: false,
  data: null,
  error: null,
  registerSuccess: false,
};

const authSlice = createSlice({
  name: "authSlice",
  initialState,
  reducers: {
    resetRegisterState: (state) => {
      state.registerSuccess = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Xử lý đăng nhập
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Xử lý đăng ký
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = null;
      state.registerSuccess = false;
    });
    builder.addCase(registerUser.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.registerSuccess = true;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { resetRegisterState } = authSlice.actions;
export default authSlice.reducer;
