import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../utils/configApi";
import { DefaultState, MessageType, User } from "../../types/types";
import { getAuthData } from "../../utils/helpers";

// Lấy tin nhắn giữa 2 người
export const getUserMessage = createAsyncThunk<
  MessageType[],
  { senderId: number; receiverId: number }
>(
  "message/getUserMessage",
  async ({ senderId, receiverId }, { rejectWithValue }) => {
    try {
      const response = await api.get(`message/${senderId}/${receiverId}`);
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lấy thông tin thất bại!");
    }
  }
);

// Xóa toàn bộ tin nhắn giữa 2 người
export const deleteUserMessage = createAsyncThunk<
  { senderId: number; receiverId: number },
  { senderId: number; receiverId: number }
>(
  "message/deleteUserMessage",
  async ({ senderId, receiverId }, { rejectWithValue }) => {
    try {
      await api.delete(`message/${senderId}/${receiverId}`);
      return { senderId, receiverId };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Xóa thông tin thất bại!");
    }
  }
);

// Lấy danh sách người đã nhắn tin
export const getPeopleMess = createAsyncThunk<User[], number>(
  "message/getPeopleMess",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`message/${userId}`);
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lấy thông tin thất bại!");
    }
  }
);

// Tạo tin nhắn mới
export const createMessage = createAsyncThunk<MessageType, MessageType>(
  "message/createMessage",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post(`message`, credentials);
      return response.data.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Tạo tin nhắn thất bại!");
    }
  }
);

const currentUserId = getAuthData()?.userId;

const initialState: DefaultState = {
  loading: false,
  listMessages: [],
  listReceivers: [],
  error: null,
};

const messageSlice = createSlice({
  name: "messageSlice",
  initialState,
  reducers: {
    updateReceiverLastMessage: (state, action) => {
      const { sender_id, receiver_id, content, sent_at } = action.payload;
      const contactId = sender_id === currentUserId ? receiver_id : sender_id;

      const existing = state.listReceivers?.find(
        (r: User) => r.user_id === contactId
      );
      if (existing) {
        existing.last_message = { content, sent_at };
      } else {
        state.listReceivers.push({
          user_id: contactId,
          full_name: "",
          avatar_url: "",
          last_message: { content, sent_at },
        });
      }
    },
    addNewMessage: (state, action: PayloadAction<MessageType>) => {
      state.listMessages = state.listMessages || [];
      state.listMessages.push(action.payload);
    },
    clearMessages: (state) => {
      state.listMessages = [];
    },
    resetError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get messages
      .addCase(getUserMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserMessage.fulfilled, (state, action) => {
        state.loading = false;
        state.listMessages = action.payload;
      })
      .addCase(getUserMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      })

      // Get people
      .addCase(getPeopleMess.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPeopleMess.fulfilled, (state, action) => {
        state.loading = false;
        state.listReceivers = action.payload;
      })
      .addCase(getPeopleMess.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      })

      // Create message
      // .addCase(createMessage.pending, (state) => {
      //   state.loading = true;
      //   state.error = null;
      // })
      // .addCase(createMessage.fulfilled, (state, action) => {
      //   state.loading = false;
      //   const newMessage = {
      //     sender_id: action.payload.sender_id,
      //     receiver_id: action.payload.receiver_id,
      //     content: action.payload.content,
      //   };
      //   state.listMessages = [...(state.listMessages || []), newMessage];

      //   const newReceiver = {
      //     user_id: action.payload.receiver_id,
      //     full_name: action.payload.receiver_full_name,
      //     avatar_url: action.payload.receiver_avatar_url,
      //     last_message: {
      //       content: action.payload.content,
      //       sent_at: action.payload.send_at,
      //     },
      //   };

      //   const existingReceiver = state.listReceivers?.find(
      //     (r: User) => r.user_id === newReceiver.user_id
      //   );

      //   if (existingReceiver) {
      //     existingReceiver.last_message = newReceiver.last_message;
      //     existingReceiver.full_name ||= newReceiver.full_name;
      //   } else {
      //     state.listReceivers.push(newReceiver);
      //   }
      // })
      // .addCase(createMessage.rejected, (state, action) => {
      //   state.loading = false;
      //   state.error = action.payload as string | null;
      // })

      // Delete message
      .addCase(deleteUserMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserMessage.fulfilled, (state, action) => {
        state.loading = false;
        const { senderId, receiverId } = action.payload;
        state.listMessages = (state.listMessages ?? []).filter(
          (message) =>
            message.sender_id !== senderId && message.receiver_id !== receiverId
        );
        if (senderId == receiverId) {
          state.listReceivers = (state.listReceivers ?? []).filter(
            (receiver: User) => receiver.user_id !== senderId
          );
        } else {
          state.listReceivers = (state.listReceivers ?? []).filter(
            (receiver: User) => receiver.user_id !== receiverId
          );
        }
      })
      .addCase(deleteUserMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      });
  },
});

export const { updateReceiverLastMessage, resetError, addNewMessage } =
  messageSlice.actions;
export default messageSlice.reducer;

// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import api from "../../utils/configApi";
// import { DefaultState, MessageType, User } from "../../types/types";

// export const getUserMessage = createAsyncThunk<
//   MessageType[],
//   { senderId: number; receiverId: number }
// >(
//   "message/getUserMessage",
//   async ({ senderId, receiverId }, { rejectWithValue }) => {
//     try {
//       const response = await api.get(`message/${senderId}/${receiverId}`);
//       return response.data.content;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data || "Lấy thông tin thất bại!");
//     }
//   }
// );

// export const deleteUserMessage = createAsyncThunk<
//   { senderId: number; receiverId: number },
//   { senderId: number; receiverId: number }
// >(
//   "message/deleteUserMessage",
//   async ({ senderId, receiverId }, { rejectWithValue }) => {
//     try {
//       await api.delete(`message/${senderId}/${receiverId}`);
//       return { senderId, receiverId }; // 👈 Trả về rõ ràng
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data || "Xóa thông tin thất bại!");
//     }
//   }
// );

// export const getPeopleMess = createAsyncThunk<User[], number>(
//   "message/getPeopleMess",
//   async (userId, { rejectWithValue }) => {
//     try {
//       const response = await api.get(`message/${userId}`);
//       return response.data.content;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data || "Lấy thông tin thất bại!");
//     }
//   }
// );

// export const createMessage = createAsyncThunk<MessageType, MessageType>(
//   "message/createMessage",
//   async (credentials, { rejectWithValue }) => {
//     try {
//       const response = await api.post(`message`, credentials);
//       return response.data.content;
//     } catch (error: any) {
//       return rejectWithValue(error.response?.data || "Lấy thông tin thất bại!");
//     }
//   }
// );

// const initialState: DefaultState = {
//   loading: false,
//   listMessages: [],
//   listReceivers: [],
//   error: null,
// };

// const messageSlice = createSlice({
//   name: "messageSlice",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(getUserMessage.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getUserMessage.fulfilled, (state, action) => {
//         state.loading = false;
//         state.listMessages = action.payload;
//       })
//       .addCase(getUserMessage.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string | null;
//       })
//       //
//       .addCase(getPeopleMess.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getPeopleMess.fulfilled, (state, action) => {
//         state.loading = false;
//         state.listReceivers = action.payload;
//       })
//       .addCase(getPeopleMess.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string | null;
//       })
//       //
//       .addCase(createMessage.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createMessage.fulfilled, (state, action) => {
//         state.loading = false;
//         const newMeassage = {
//           sender_id: action.payload.sender_id,
//           receiver_id: action.payload.receiver_id,
//           content: action.payload.content,
//         };
//         state.listMessages = [...(state.listMessages || []), newMeassage];
//         const newReceiver = {
//           user_id: action.payload.receiver_id,
//           full_name: action.payload.receiver_full_name,
//           avatar: action.payload.receiver_avatar_url,
//           last_message: {
//             content: action.payload.content,
//             sent_at: action.payload.send_at,
//           }
//         };
//         const existingReceiver = (state.listReceivers ?? []).find(
//           (receiver) => receiver.user_id === action.payload.receiver_id
//         );
//         if (existingReceiver) {
//           state.listReceivers = (state.listReceivers ?? []).map((receiver) =>
//             receiver.user_id === action.payload.receiver_id
//               ? {
//                   ...receiver,
//                   ...newReceiver,
//                   full_name: newReceiver.full_name || receiver.full_name || "",
//                 }
//               : receiver
//           );
//         }
//       })
//       .addCase(createMessage.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string | null;
//       })
//       //
//       .addCase(deleteUserMessage.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(deleteUserMessage.fulfilled, (state, action) => {
//         state.loading = false;
//         const { senderId, receiverId } = action.payload;
//         state.listMessages = (state.listMessages ?? []).filter(
//           (message) =>
//             message.sender_id !== senderId && message.receiver_id !== receiverId
//         );
//         if(senderId == receiverId){
//           state.listReceivers = (state.listReceivers ?? []).filter(
//             (receiver) =>
//             receiver.user_id !== senderId
//           )
//         }else{
//           state.listReceivers = (state.listReceivers ?? []).filter(
//             (receiver) =>
//             receiver.user_id !== receiverId
//           )
//         }
//       })
//       .addCase(deleteUserMessage.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string | null;
//       })
//   },
// });

// export default messageSlice.reducer;
