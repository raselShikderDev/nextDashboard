import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Notification } from "../../../types";

interface NotificationsState {
  items: Notification[];
  unreadCount: number;
  isPanelOpen: boolean;
}

const initialState: NotificationsState = {
  items: [],
  unreadCount: 0,
  isPanelOpen: false,
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    setNotifications(state, action: PayloadAction<Notification[]>) {
      state.items = action.payload;
      state.unreadCount = action.payload.filter((n) => !n.isRead).length;
    },
    addNotification(state, action: PayloadAction<Notification>) {
      state.items.unshift(action.payload);
      if (!action.payload.isRead) state.unreadCount += 1;
    },
    markAsRead(state, action: PayloadAction<string>) {
      const notification = state.items.find((n) => n.id === action.payload);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead(state) {
      state.items.forEach((n) => (n.isRead = true));
      state.unreadCount = 0;
    },
    removeNotification(state, action: PayloadAction<string>) {
      const index = state.items.findIndex((n) => n.id === action.payload);
      if (index !== -1) {
        if (!state.items[index].isRead) state.unreadCount = Math.max(0, state.unreadCount - 1);
        state.items.splice(index, 1);
      }
    },
    togglePanel(state) {
      state.isPanelOpen = !state.isPanelOpen;
    },
    closePanel(state) {
      state.isPanelOpen = false;
    },
  },
});

export const { setNotifications, addNotification, markAsRead, markAllAsRead, removeNotification, togglePanel, closePanel } = notificationsSlice.actions;
export default notificationsSlice.reducer;
