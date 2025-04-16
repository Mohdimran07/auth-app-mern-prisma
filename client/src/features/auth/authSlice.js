import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    AddUser: (state, action) => {
      state.userInfo = action.payload;

      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    removeUser: (state, action) => {
      state.userInfo = null;
      localStorage.clear();
    },
  },
});

export const { AddUser, removeUser } = authSlice.actions;

export default authSlice.reducer;
