import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  register: [],
  status: 'idle',
  error: null,
};

export const postRegister = createAsyncThunk(
  'register/postRegister',
  async ({ firstName, lastName, email, pwd, matchPwd }) => {
    try {
      let response = null;
      response = await axios.post(
        'https://notflixtv.herokuapp.com/api/v1/users',
        {
          first_name: firstName,
          last_name: lastName,
          email: email,
          password: pwd,
          password_confirmation: pwd,
        }
      );
      //   console.log(response);
      console.log(response);
      localStorage.setItem('user-info', JSON.stringify(response?.data));
      return response?.data;
    } catch (error) {
      console.error(error);
    }
  }
);

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(postRegister.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(postRegister.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // console.log(action.payload);
        state.register = action.payload;
      })
      .addCase(postRegister.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const selectRegister = (state) => state.register.register;
export const selectRegisterStatus = (state) => state.register.status;
export const getRegisterError = (state) => state.register.error;

export default registerSlice.reducer;
