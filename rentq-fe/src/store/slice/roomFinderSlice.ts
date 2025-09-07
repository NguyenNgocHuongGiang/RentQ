import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  DefaultState,
  PostsType,
  RoomFinderType,
  RoommateRequestType,
} from "../../types/types";
import api from "../../utils/configApi";

export const getUserPostProfile = createAsyncThunk<any, number>(
  "users/getUserPostProfile",
  async (user_id, { rejectWithValue }) => {
    try {
      const response = await api.get(`users/get-user-post-profile/${user_id}`);
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lấy thông tin thất bại!");
    }
  }
);

export const getActiveRoomFinder = createAsyncThunk<
  any,
  { page?: number; limit?: number }
>(
  "roomFinder/getActiveRoomFinder",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`room-finder/active`, {
        params: { page, limit },
      });
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lấy thông tin thất bại!");
    }
  }
);

export const getListPostMatched = createAsyncThunk<
  PostsType[],
  { finder_id: number; topN?: number }
>(
  "roomFinder/getListPostMatched",
  async ({ finder_id, topN }, { rejectWithValue }) => {
    try {
      const response = await api.get(`room-finder/matched/${finder_id}`, {
        params: topN ? { topN } : undefined,
      });
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lấy thông tin thất bại!");
    }
  }
);

export const getActiveRoommateRequest = createAsyncThunk<
  any,
  { page?: number; limit?: number }
>(
  "roomFinder/getActiveRoommateRequest",
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`roommate-request/active`, {
        params: { page, limit },
      });
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lấy thông tin thất bại!");
    }
  }
);

export const createNewPostFindRoom = createAsyncThunk<any, RoomFinderType>(
  "roomFinder/createNewPostFindRoom",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post(`room-finder`, credentials);
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Create failed!");
    }
  }
);

export const createRoommateRequest = createAsyncThunk<
  RoommateRequestType,
  RoommateRequestType
>(
  "roomFinder/createRoommateRequest",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post(`roommate-request`, credentials);
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Create failed!");
    }
  }
);

// export const deleteBill = createAsyncThunk<BillType, number>(
//   "bill/deleteBill",
//   async (billId, { rejectWithValue }) => {
//     try {
//       const response = await api.delete(`bills/${billId}`);
//       console.log(response.data.content);
//       return response.data.content;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data || "Xóa thất bại!");
//     }
//   }
// );

const initialState: DefaultState = {
  listPostProfile: [],
  loading: false,
  error: null,
  listActiveRoommateRequest: [],
};

const roomFinderSlice = createSlice({
  name: "roomFinderSlice",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createNewPostFindRoom.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewPostFindRoom.fulfilled, (state, action) => {
        state.loading = false;

        const hasFinderId = !!action.payload.finder_id;

        const newPost = {
          ...action.payload,
          label: hasFinderId ? "room_finder" : "post",
          unique_id: hasFinderId
            ? `room-${action.payload.finder_id}`
            : `post-${action.payload.post_id}`,
        };

        state.listPostProfile = [newPost, ...(state.listPostProfile ?? [])];
      })
      .addCase(createNewPostFindRoom.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    builder
      .addCase(createRoommateRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRoommateRequest.fulfilled, (state, action) => {
        state.loading = false;

        console.log(action.payload);
        
        
        const newPost = {
          ...action.payload,
          label: "roommate-requests",
          unique_id: `roommate-requests-${action.payload.request_id}`,
        };
        state.listPostProfile = [newPost, ...(state.listPostProfile ?? [])];
      })
      .addCase(createRoommateRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // builder
    //   .addCase(deleteBill.pending, (state) => {
    //     state.loading = true;
    //     state.error = null;
    //   })
    //   .addCase(deleteBill.fulfilled, (state, action) => {
    //     state.loading = false;
    //     console.log(action.payload);
    //     state.listBills = state.listBills?.filter(
    //       (bill) => bill.bill_id !== action.payload.bill_id
    //     );
    //   })
    //   .addCase(deleteBill.rejected, (state, action) => {
    //     state.loading = false;
    //     state.error = action.payload as string;
    //   });
    builder
      .addCase(getUserPostProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserPostProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.listPostProfile = action.payload;
      })
      .addCase(getUserPostProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default roomFinderSlice.reducer;
