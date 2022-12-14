import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import apiConfig from '../../api/apiConfig';
import { category as cate } from '../../api/tmdbApi';

const initialState = {
  detail: [],
  status: 'idle',
  error: null,
};

export const fetchDetailMovie = createAsyncThunk(
  'movies/fetchDetailMovie',
  async ({ category, id }) => {
    try {
      let response = null;
      const params = { api_key: apiConfig.apiKey };
      response = await axios.get(
        `${apiConfig.baseUrl}${cate[category]}/${id}`,
        {
          params,
        }
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }
);

const detailSlice = createSlice({
  name: 'detail',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchDetailMovie.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchDetailMovie.fulfilled, (state, action) => {
        state.status = 'succeeded';
        // console.log(action.payload);
        state.detail = action.payload;
      })
      .addCase(fetchDetailMovie.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const selectDetail = (state) => state.detail.detail;
export const selectDetailStatus = (state) => state.detail.status;
export const getDetailError = (state) => state.detail.error;

export default detailSlice.reducer;
