import { isRejectedWithValue } from '@reduxjs/toolkit';
import { createListenerMiddleware } from '@rtk-incubator/action-listener-middleware';
import { setErors } from 'src/features/error/errorSlice';

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: isRejectedWithValue,
  effect: async (action, listenerApi) => {
    return listenerApi.dispatch(setErors({ type: action.type, errors: action.payload.data }));
  },
});

export default listenerMiddleware;
