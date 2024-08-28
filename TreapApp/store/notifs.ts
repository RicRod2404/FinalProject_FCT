import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from ".";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Interface que define o estado das notificações
export interface NotificationsState {
    notifications: string[];
}

// Estado inicial das notificações
const initialState: NotificationsState = {
    notifications: [],
};

// Criação do slice de notificações
export const notificationsSlice = createSlice({
    name: "notifications",
    initialState: initialState,
    reducers: {
        addNotification: (state, action: PayloadAction<string>) => {
            state.notifications.push(action.payload);
            AsyncStorage.setItem("notifications", JSON.stringify(state.notifications));
        },
        removeNotification: (state, action: PayloadAction<number>) => {
            state.notifications.splice(action.payload, 1);
            AsyncStorage.setItem("notifications", JSON.stringify(state.notifications));
        },
        clearNotifications: (state) => {
            state.notifications = [];
            AsyncStorage.removeItem("notifications");
        },
        loadNotifications: (state, action: PayloadAction<string[]>) => {
            state.notifications = action.payload;
        },
    },
});

// Selector para acessar as notificações no estado global
export const notificationsSelector = (state: RootState) => state.notifications;

// Exportação das ações e do reducer do slice
export const { addNotification, removeNotification, clearNotifications, loadNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
