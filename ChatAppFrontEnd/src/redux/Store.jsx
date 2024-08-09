import { configureStore } from '@reduxjs/toolkit';
import AuthSlice from "./slice/AuthSlice";
import ChatSlice from './slice/ChatSlice';
import UserSlice from './slice/UserSlice';

// Define the store
const store= configureStore({
  reducer: {
    auth: AuthSlice,
    chat: ChatSlice,
    user: UserSlice
  },
});

export default store;

