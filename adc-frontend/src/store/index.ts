import { configureStore } from "@reduxjs/toolkit";
import { sessionSlice } from "./session";
import { configSlice } from "./config";
import { snackbarSlice } from "./snackbar";
import {communitySlice} from "./community.ts";
//import logger from "redux-logger";

const store = configureStore({
  reducer: {
    session: sessionSlice.reducer,
    config: configSlice.reducer,
    snackbar: snackbarSlice.reducer,
    community: communitySlice.reducer,
  },
  //middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

type RootState = ReturnType<typeof store.getState>;

export type { RootState };
export default store;
