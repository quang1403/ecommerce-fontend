import { createSlice, current } from "@reduxjs/toolkit";
const initialState = {
  login: {
    currentCustomer: null,
    loggedIn: false,
    error: false,
  },
};
const authReducer = createSlice({
  name: "authReducer",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.login.currentCustomer = action.payload;
      state.login.loggedIn = true;
    },
    logoutSuccess: (state, action) => {
      state.login.loggedIn = false;
      state.login.currentCustomer = null;
    },
    updateSuccess: (state, action) => {},
    updateTokenSuccess: (state, action) => {},
    updateUserAddresses: (state, action) => {
      if (state.login.currentCustomer) {
        state.login.currentCustomer.addresses = action.payload;
      }
    },
  },
});
export const {
  loginSuccess,
  logoutSuccess,
  updateSuccess,
  updateTokenSuccess,
  updateUserAddresses,
} = authReducer.actions;
export default authReducer.reducer;
