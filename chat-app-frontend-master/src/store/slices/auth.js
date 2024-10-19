import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  _id: "",
  username: "",
  email: "",
  mobile: "",
  access: "",
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginAuth: (state, action) => {
      state._id = action.payload._id;
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.mobile = action.payload.mobile;
      state.access = action.payload.access;
    },
    logOutAuth: (state, action) => {
      state._id = "";
      state.username = "";
      state.email = "";
      state.mobile = "";
      state.access = "";
    },
  },
});

export default authSlice.reducer;
export const { loginAuth, logOutAuth } = authSlice.actions;
export const getAuth = (state) => state.auth;
