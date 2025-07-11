import { getFeedsApi, getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrdersData } from '@utils-types';

type TFeedsState = {
  ordersData: TOrdersData;
  isLoading: boolean;
  error: string | null;
};

export const initialState: TFeedsState = {
  ordersData: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  isLoading: false,
  error: null
};

export const getFeeds = createAsyncThunk<TOrdersData>(
  'feeds/getFeeds',
  async () => getFeedsApi()
);

const slice = createSlice({
  name: 'feedsSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.ordersData = action.payload;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message!;
      });
  },
  selectors: {
    getOrdersData: (state) => state.ordersData.orders,
    getLoadingStatus: (state) => state.isLoading,
    getTotal: (state) => state.ordersData.total,
    getTotalToday: (state) => state.ordersData.totalToday
  }
});

export const { getOrdersData, getLoadingStatus, getTotal, getTotalToday } =
  slice.selectors;

export default slice.reducer;
