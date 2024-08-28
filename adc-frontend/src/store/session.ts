import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";
import { jwtDecode } from "jwt-decode";

export interface Session {
  email: string;
  nickname: string;
  profilePic: string;
  token: string;
  role: string;
  iat: string;
  exp: string;
  jti: string;
  isLogged: boolean;
  validated: boolean;
}

const initialState: Session = {
  email: "",
  nickname: "",
  profilePic: "",
  token: "",
  role: "",
  iat: "",
  exp: "",
  jti: "",
  isLogged: false,
  validated: false,
};

export const sessionSlice = createSlice({
  name: "session",
  initialState: initialState,
  reducers: {
    login: (_: Session, action: PayloadAction<Session>) => {
      localStorage.setItem("token", action.payload.token);
      return action.payload;
    },
    logout: () => {
      localStorage.removeItem("token");
      return initialState;
    },
    resetToken: (state: Session, action: PayloadAction<string>) => {
      state.token = action.payload;
      let t: any = jwtDecode(state.token.split(" ")[1]);
      state.exp = t.exp;
      localStorage.setItem("token", action.payload);
      return state;
    },
  },
});

export const sessionSelector = createSelector(
  (state: RootState) => state,
  (state) => state.session
);

export const { login, logout, resetToken } = sessionSlice.actions;
