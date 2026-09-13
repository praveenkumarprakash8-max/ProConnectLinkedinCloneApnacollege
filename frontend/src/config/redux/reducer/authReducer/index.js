import { createSlice } from "@reduxjs/toolkit";
import {
  getAboutUser,
  getAllUsers,
  getConnectionRequests,
  getMyConnectionRequest,
  loginUser,
  registerUser,
} from "../../action/authAction";

const initialState = {
  user: undefined,
  isError: false,
  isSuccess: false,
  isLoading: false,
  loggedIn: false,
  message: "",
  isTokenThere: false,
  profileFetched: false,
  connection: [],
  connectionRequest: [],
  all_users: [],
  all_profiles_fetch: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    reset: () => initialState,
    handleLoginUser: (state) => {
      state.message = "hello";
    },
    emptyMessage: (state) => {
      state.message = "";
    },
    setIsTokenThere: (state) => {
      state.isTokenThere = true;
    },
    setTokenIsNotThere: (state) => {
      state.isTokenThere = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.message = "knocking the door....";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.loggedIn = true;
        state.message = "login is successful";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.message = "Registering you..";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.loggedIn = false;
        state.message = {
          message: "Registering is successful,Please Login in",
        };
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(getAboutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.profileFetched = true;
        state.user = action.payload?.profile;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.all_profiles_fetch = true;
        state.all_users =
          action.payload?.profiles ||
          action.payload?.profile ||
          action.payload ||
          [];
      })
      .addCase(getConnectionRequests.fulfilled, (state, action) => {
        state.connection = action.payload;
      })
      .addCase(getConnectionRequests.rejected, (state, action) => {
        state.message = action.payload;
      })
      .addCase(getMyConnectionRequest.fulfilled, (state, action) => {
        state.connectionRequest = action.payload;
      })
      .addCase(getMyConnectionRequest.rejected, (state, action) => {
        state.message = action.payload;
      });
  },
});

export const {
  reset,
  handleLoginUser,
  emptyMessage,
  setIsTokenThere,
  setTokenIsNotThere,
} = authSlice.actions;
export default authSlice.reducer;
