import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  ContractTenant,
  ContractTenantRequest,
  ContractType,
  DefaultState,
} from "../../types/types";
import api from "../../utils/configApi";

export const getLandlordContracts = createAsyncThunk<any, number>(
  "contract/getLandlordContracts",
  async (user_id, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `contracts/get-contract-by-landlordId/${user_id}`
      );
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lấy thông tin thất bại!");
    }
  }
);

export const getContractByTenantID = createAsyncThunk<any, number>(
  "contract/getContractByTenantID",
  async (tenant_id, { rejectWithValue }) => {
    try {
      const response = await api.get(`contract-tenants/${tenant_id}`);
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lấy thông tin thất bại!");
    }
  }
);

export const createNewContract = createAsyncThunk<ContractType, ContractType>(
  "contract/createNewContract",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post(`contracts`, credentials);
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Create failed!");
    }
  }
);

export const createContractTenant = createAsyncThunk<
  ContractTenant[],
  ContractTenantRequest
>("contract/createContractTenant", async (credentials, { rejectWithValue }) => {
  try {
    const response = await api.post(`contract-tenants`, credentials);
    return response.data.content;
  } catch (error: any) {
    return rejectWithValue(error.response?.data || "Create failed!");
  }
});

const initialState: DefaultState = {
  listContracts: [],
  loading: false,
  error: null,
};

const contractSlice = createSlice({
  name: "contractSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getLandlordContracts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getLandlordContracts.fulfilled, (state, action) => {
      state.loading = false;
      state.listContracts = action.payload;
    });
    builder.addCase(getLandlordContracts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create new contract
    builder.addCase(createNewContract.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createNewContract.fulfilled, (state, action) => {
      state.loading = false;
      state.listContracts = [...(state.listContracts || []), action.payload];
    });
    builder.addCase(createNewContract.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Get contract by tenant ID
    builder.addCase(getContractByTenantID.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getContractByTenantID.fulfilled, (state, action) => {
      state.loading = false;
      const tenantContracts = action.payload.map((item: any) => ({
        ...item.contracts,
      }));
      state.listContracts = tenantContracts;
    });
    builder.addCase(getContractByTenantID.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default contractSlice.reducer;
