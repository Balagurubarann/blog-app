import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
  error: null,
  loading: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logInStart: (state) => {
      (state.loading = true), (state.error = null);
    },
    logInSuccess: (state, action) => {
      (state.currentUser = action.payload),
        (state.loading = false),
        (state.error = null);
    },
    logInFailure: (state, action) => {
      (state.error = action.payload), (state.loading = false);
    },
    updateStart: (state) => {
      (state.loading = true), (state.error = null);
    },
    updateSuccess: (state, action) => {
      (state.currentUser = action.payload),
        (state.loading = false),
        (state.error = null);
    },
    updateFailure: (state, action) => {
      (state.error = action.payload), (state.loading = false);
    },
    deleteUserStart: (state) => {
      (state.loading = true), (state.error = null);
    },
    deleteUserSuccess: (state) => {
      (state.currentUser = null), (state.loading = false), (state.error = null);
    },
    deleteUserFailure: (state, action) => {
      (state.loading = false), (state.error = action.payload);
    },
    logoutSuccess: (state) => {
      (state.currentUser = null), (state.error = null), (state.loading = false);
    },
    createPostStart: (state) => {
      (state.loading = true), (state.error = null);
    },
    createPostFailure: (state, action) => {
        (state.loading = false),
        (state.error = action.payload);
    },
    createPostSuccess: (state, action) => {
        (state.loading = false),
        (state.error = false);
    },
  },
});

export const {
  logInStart,
  logInSuccess,
  logInFailure,
  updateStart,
  updateSuccess,
  updateFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  logoutSuccess,
  createPostFailure,
  createPostStart,
  createPostSuccess,
} = userSlice.actions;
export default userSlice.reducer;
