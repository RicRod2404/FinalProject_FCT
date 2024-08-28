import { configureStore } from "@reduxjs/toolkit";
import { sessionSlice } from "./session";
import { snackbarSlice } from "./snackbar";
import { treapSlice } from "./treap";
import { notificationsSlice } from "./notifs"

import {apiSlice} from "./api";
const store = configureStore({
  reducer: {
    session: sessionSlice.reducer,
    snackbar: snackbarSlice.reducer,
    treap: treapSlice.reducer,
    api: apiSlice.reducer,
    notifications: notificationsSlice.reducer,
  },
});

type RootState = ReturnType<typeof store.getState>;

export type { RootState };
export default store;
