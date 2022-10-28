import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import apiConfig from '../../api/apiConfig';

const initialState = {
  login: [],
  status: 'idle',
  error: null,
};

export const postLogin = createAsyncThunk(
  'login/postLogin',
  async ({ user, password }) => {
    try {
      let response = null;
      const params = { email: user, password: password };
      //   console.log(params);
      response = await axios.post(
        'https://notflixtv.herokuapp.com/api/v1/users/login',
        { email: user, password: password }
      );

      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
);

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(postLogin.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(postLogin.fulfilled, (state, action) => {
        state.status = 'succeeded';

        localStorage.setItem('user-info', JSON.stringify(action.payload));
        state.login = action.payload;
      })
      .addCase(postLogin.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const selectLogin = (state) => state.login.login;
export const selectLoginStatus = (state) => state.login.status;
export const getLoginError = (state) => state.login.error;

export default loginSlice.reducer;
