import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import errorHandler from 'src/libs/error-handler';
import storage, { tokenKey } from 'src/utils/storage';
import { signin, signinWithToken, signup } from './authAPI';

const initialState = {
  _token: storage.get(tokenKey),
  userdata: null,
  status: 'auth_check',
  registered: false,
};

export const checkAuthAsync = createAsyncThunk(
  'auth/checkAuth',
  errorHandler(async () => signinWithToken()),
);

export const signinAsync = createAsyncThunk(
  'auth/signin',
  errorHandler(async ({ email, password }) => signin(email, password)),
);

export const singupAsync = createAsyncThunk(
  'auth/signup',
  errorHandler(async data => signup(data)),
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action) => {
      state._token = action.payload;
      storage.set(tokenKey, state._token);
    },
    setUserData: (state, action) => {
      state.userdata = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(checkAuthAsync.pending, state => {
        state.status = 'auth_check';
      })
      .addCase(checkAuthAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        if (action.payload.status !== 'success') {
          state._token = null;
          storage.set(tokenKey, state._token);
        } else {
          state.userdata = action.payload.userdata;
        }
      })
      .addCase(signinAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(signinAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state._token = action.payload.token;
        state.userdata = action.payload.userdata;
        storage.set(tokenKey, state._token);
      })
      .addCase(singupAsync.pending, state => {
        state.status = 'loading';
      })
      .addCase(singupAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.registered = true;
      });
  },
});

export const { setToken, setUserData, setStatus } = authSlice.actions;

export const selectToken = state => state.auth._token;
export const selectUserdata = state => state.auth.userdata;
export const selectAuthStatus = state => state.auth.status;
export const selectRegistered = state => state.auth.registered;

// export const thunkByHand = data => (dispatch, getState) => {
//   const _token = selectToken(getState());
//   dispatch(setToken(_token));
// };

export default authSlice.reducer;
