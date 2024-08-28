import {createSelector, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "./index.ts";

export interface Community {
    name: string;
}

const initialCommunity: Community = {
    name: ""
};

export const communitySlice = createSlice({
    name: "community",
    initialState: initialCommunity,
    reducers: {
        setCommunity: (state: Community, action: PayloadAction<Community>) => {
            state = action.payload;
            return state;
        }
    }
});

export const communitySelector = createSelector(
    (state: RootState) => state,
    (state) => state.community
);

export const {setCommunity} = communitySlice.actions;