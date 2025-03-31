import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../pages/AuthTemplate/slice";
import userReducer from "./slice/userSlice";
import postReducer from "./slice/postSlice";

export const store = configureStore({
  reducer: {
    authReducer,
    userReducer,
    postReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
