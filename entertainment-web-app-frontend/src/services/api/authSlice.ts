import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../types/auth";
import { RootState } from "./store";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

interface SetCredentialsPayload {
  user: User;
  accessToken?: string;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<SetCredentialsPayload>) => {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },

    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },

    updateUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
    },
  },
});

export const { setCredentials, logout, updateUser } = authSlice.actions;

export default authSlice.reducer;

export const selectCurrentAuthSate = (state: RootState) => state.auth;
