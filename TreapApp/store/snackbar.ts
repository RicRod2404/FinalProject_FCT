import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";

export interface Snackbar {
  open: boolean;
  message: string;
  autoHideDuration: number;
  type?: "success" | "error" | "warning" | "info";
}

const initialState: Snackbar = {
  open: false,
  message: "",
  autoHideDuration: 3000,
};

export const snackbarSlice = createSlice({
  name: "snackbar",
  initialState: initialState,
  reducers: {
    set: (_: Snackbar, action: PayloadAction<Snackbar>) => {
      return action.payload;
    },
    unset: () => initialState,
  },
});

export const snackbarSelector = createSelector(
  (state: RootState) => state,
  (state) => state.snackbar
);

export const { set, unset } = snackbarSlice.actions;
