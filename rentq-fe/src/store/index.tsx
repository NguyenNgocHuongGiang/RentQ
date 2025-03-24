import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../pages/AuthTemplate/slice";
import userReducer from "../pages/UserTemplate/slice";

export const store = configureStore({
  reducer: {
    authReducer,
    userReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;