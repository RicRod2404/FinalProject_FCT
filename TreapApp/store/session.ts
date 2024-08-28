import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
    login: (_, action: PayloadAction<Session>) => {
      AsyncStorage.setItem("token", action.payload.token);
      return action.payload;
    },
    logout: (state) => {
      AsyncStorage.removeItem("token");
      state = initialState;
      return initialState;
    },
    resetToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      let t: any = jwtDecode(action.payload.split(" ")[1]);
      state.exp = t.exp;
      AsyncStorage.setItem("token", action.payload);
      return state;
    },
    updateUser: (state, action: PayloadAction<Session>) => {
      const { nickname, profilePic } = action.payload;
      if (nickname) state.nickname = nickname;
      state.profilePic = profilePic;
      return state;
    },
  },
});

export const sessionSelector = createSelector(
  (state: RootState) => state,
  (state) => state.session
);

export const { login, logout, resetToken, updateUser } = sessionSlice.actions;
