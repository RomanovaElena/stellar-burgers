import { TOrder } from '@utils-types';
import {
  createAsyncThunk,
  createSlice,
  SerializedError
} from '@reduxjs/toolkit';
import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';

export interface TOrderState {
  orderModalData: TOrder | null;
  ordersData: TOrder[];
  isLoading: boolean;
  error: string | null;
}

const initialState: TOrderState = {
  orderModalData: null,
  ordersData: [],
  isLoading: false,
  error: null
};

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (data: string[]) => orderBurgerApi(data)
);

export const getOrderById = createAsyncThunk(
  'orders/getById',
  async (number: number) => getOrderByNumberApi(number)
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
      })
      .addCase(getOrderById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.orderModalData = action.payload.orders[0];
        state.isLoading = false;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.error = action.error.message!;
        state.isLoading = false;
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
