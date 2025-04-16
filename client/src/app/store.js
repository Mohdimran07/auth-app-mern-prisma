import { configureStore } from "@reduxjs/toolkit";
import authSliceReducers from "../features/auth/authSlice";
import { apiSlice } from "../services/api";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSliceReducers,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
