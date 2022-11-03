import { configureStore } from '@reduxjs/toolkit';
import authSlice from 'src/features/auth/authSlice';
import errorSlice from 'src/features/error/errorSlice';
import listenerMiddleware from 'src/libs/listener.middleware';
import configSlice from './features/config/configSlice';

export default configureStore({
  reducer: {
    auth: authSlice,
    error: errorSlice,
    config: configSlice,
  },
  middleware: getDefaultMiddleware => {
    return getDefaultMiddleware().prepend(listenerMiddleware.middleware);
  },
});
