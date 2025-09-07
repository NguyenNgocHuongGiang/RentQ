import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../pages/AuthTemplate/slice";
import userReducer from "./slice/userSlice";
import postReducer from "./slice/postSlice";
import propertyReducer from "./slice/propertySlice";
import messageReducer from "./slice/messageSlice";
import constractReducer from "./slice/contractSlice";
import billReducer from "./slice/billSlice";
import roomFinderReducer from "./slice/roomFinderSlice";

export const store = configureStore({
  reducer: {
    authReducer,
    userReducer,
    postReducer,
    propertyReducer,
    messageReducer,
    constractReducer,
    billReducer,
    roomFinderReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
