import { configureStore } from '@reduxjs/toolkit';
import authReducer   from './slices/authSlice';
import forumsReducer from './slices/forumsSlice';
import groupsReducer from './slices/groupsSlice';
import chatReducer   from './slices/chatSlice';

export const store = configureStore({
  reducer: {
    auth:   authReducer,
    forums: forumsReducer,
    groups: groupsReducer,
    chat:   chatReducer,
  },
});

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
