import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BillType, DefaultState } from "../../types/types";
import api from "../../utils/configApi";

export const getLandlordBills = createAsyncThunk<
  any,
  { user_id: number; yearNumber: string }
>(
  "bill/getLandlordBills",
  async ({ user_id, yearNumber }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `bills/get-by-landlordId/${user_id}?year=${yearNumber}`
      );
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lấy thông tin thất bại!");
    }
  }
);

export const getTenantBills = createAsyncThunk<any, number>(
  "bill/getTenantBills",
  async (user_id, { rejectWithValue }) => {
    try {
      const response = await api.get(`bills/get-by-tenantId/${user_id}`);
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lấy thông tin thất bại!");
    }
  }
);

export const createNewBill = createAsyncThunk<BillType, BillType>(
  "bill/createNewBill",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post(`bills`, credentials);
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Create failed!");
    }
  }
);

export const deleteBill = createAsyncThunk<BillType, number>(
  "bill/deleteBill",
  async (billId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`bills/${billId}`);
      console.log(response.data.content);
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Xóa thất bại!");
    }
  }
);

const initialState: DefaultState = {
  listBills: [],
  loading: false,
  error: null,
};

const billSlice = createSlice({
  name: "billSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getLandlordBills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLandlordBills.fulfilled, (state, action) => {
        state.loading = false;
        state.listBills = action.payload;
      })
      .addCase(getLandlordBills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(createNewBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewBill.fulfilled, (state, action) => {
        state.loading = false;
        state.listBills = [...(state.listBills ?? []), action.payload];
      })
      .addCase(createNewBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(deleteBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBill.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);
        state.listBills = state.listBills?.filter(
          (bill) => bill.bill_id !== action.payload.bill_id
        );
      })
      .addCase(deleteBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
    builder
      .addCase(getTenantBills.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getTenantBills.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);
        state.listBills = action.payload
      })
      .addCase(getTenantBills.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default billSlice.reducer;
