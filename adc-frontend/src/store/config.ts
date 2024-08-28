import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";

export interface Config {
  lang: string;
  theme: string;
}

const initialConfig: Config = {
  lang: localStorage.getItem("lang") || "pt",
  theme: localStorage.getItem("theme") || "dark",
};

export const configSlice = createSlice({
  name: "config",
  initialState: initialConfig,
  reducers: {
    changeLang: (state: Config, action: PayloadAction<string>) => {
      state.lang = action.payload;
      localStorage.setItem("lang", state.lang);
      return state;
    },
    changeTheme: (state: Config, action: PayloadAction<string>) => {
      state.theme = action.payload;
      localStorage.setItem("theme", state.theme);
      return state;
    },
  },
});

export const configSelector = createSelector(
  (state: RootState) => state,
  (state) => state.config
);

export const { changeLang, changeTheme } = configSlice.actions;
