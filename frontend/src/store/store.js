// store/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    // add other slices here as the app grows: tickets, masterData, etc.
  },
});

export default store;