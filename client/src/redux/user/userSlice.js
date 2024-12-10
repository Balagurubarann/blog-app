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
  },
});

export const {
  logInStart,
  logInSuccess,
  logInFailure,
  updateStart,
  updateSuccess,
  updateFailure
} = userSlice.actions;
export default userSlice.reducer;
