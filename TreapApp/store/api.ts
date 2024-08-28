import {createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "./index";

export interface Api {
    maps: string;
}

const initialState: Api = {
    maps: "",
};

export const apiSlice = createSlice({
    name: "api",
    initialState: initialState,
    reducers: {
        setMaps: (_, action: PayloadAction<Api>) => {
            return action.payload;
        },
    },
});

export const apiSelector = createSelector(
    (state: RootState) => state,
    (state) => state.api
);

export const {setMaps} = apiSlice.actions;