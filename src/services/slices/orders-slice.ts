import { TOrder } from '@utils-types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderBurgerApi } from '@api';

export interface TOrderState {
  orderModalData: TOrder | null;
  isLoading: boolean;
  error: string | null;
}

export const initialState: TOrderState = {
  orderModalData: null,
  isLoading: false,
  error: null
};

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (data: string[]) => orderBurgerApi(data)
);

const slice = createSlice({
  name: 'ordersSlice',
  initialState,
  reducers: {
    resetOrderData(state) {
      state.orderModalData = null;
    }
  },
  extraReducers(builder) {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderModalData = action.payload.order;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message!;
      });
  },
  selectors: {
    getOrderModalData: (state) => state.orderModalData,
    getLoadingStatus: (state) => state.isLoading
  }
});

export const { resetOrderData } = slice.actions;
export const { getOrderModalData, getLoadingStatus } = slice.selectors;
export default slice.reducer;
