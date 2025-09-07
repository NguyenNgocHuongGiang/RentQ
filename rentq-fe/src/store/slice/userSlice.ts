import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/configApi";
import {
  BankAccountType,
  DefaultState,
  RoleRequest,
  RoleRequestType,
} from "../../types/types";

export const getInfoUser = createAsyncThunk<any, number>(
  "user/getInfo",
  async (user_id, { rejectWithValue }) => {
    try {
      const response = await api.get(`users/${user_id}`);
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
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lấy thông tin thất bại!");
    }
  }
);

export const createBankAccount = createAsyncThunk<
  BankAccountType,
  BankAccountType
>("user/createBankAccount", async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post(`users/create-bank-account`, credentials);
    return response.data.content;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Send request failed!");
  }
});

export const getBankAccount = createAsyncThunk<BankAccountType[], number>(
  "user/getBankAccount",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`users/get-bank-account/${userId}`);
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Get request failed!");
    }
  }
);

export const getBankAccountDefault = createAsyncThunk<BankAccountType, number>(
  "user/getBankAccountDefault",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`users/get-bank-account-default/${userId}`);
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Get request failed!");
    }
  }
);

const initialState: DefaultState = {
  loading: false,
  data: null,
  error: null,
  listBankAccount: [],
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

    //
    builder.addCase(getBankAccount.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getBankAccount.fulfilled, (state, action) => {
      state.loading = false;
      state.listBankAccount = action.payload;
    });
    builder.addCase(getBankAccount.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    //
    builder.addCase(createBankAccount.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createBankAccount.fulfilled, (state, action) => {
      state.loading = false;
      if (action.payload.is_default) {
        state.listBankAccount = (state.listBankAccount ?? []).map((acc) => ({
          ...acc,
          is_default: false,
        }));
      }
      state.listBankAccount = [
        ...(state.listBankAccount ?? []),
        action.payload,
      ];
    });
    builder.addCase(createBankAccount.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default userSlice.reducer;
