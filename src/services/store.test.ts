import { configureStore } from '@reduxjs/toolkit';
import { TConstructorState } from './slices/burger-constructor-slice';
import { TIngredientsState } from './slices/burger-ingredients-slice';
import { TFeedsState } from './slices/feeds-slice';
import { TOrderState } from './slices/orders-slice';
import { TUserState } from './slices/users-slice';
import { rootReducer } from './store';

describe('проверить правильную инициализацию rootReducer', () => {
  const burgerConstructorInitialState: TConstructorState = {
    bun: null,
    ingredients: []
  };

  const ingredientsInitialState: TIngredientsState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  const feedsInitialState: TFeedsState = {
    ordersData: {
      orders: [],
      total: 0,
      totalToday: 0
    },
    order: null,
    isLoading: false,
    error: null
  };

  const orderInitialState: TOrderState = {
    orderModalData: null,
    isLoading: false,
    error: null
  };

  const userInitialState: TUserState = {
    isAuthChecked: false,
    userData: null,
    userOrders: [],
    isLoading: false,
    error: null
  };

const preloadedState = {
  burgerConstructorSlice: burgerConstructorInitialState,
  ingredientsSlice: ingredientsInitialState,
  ordersSlice: orderInitialState,
  feedsSlice: feedsInitialState,
  userSlice: userInitialState
};

  test('тест инициализации стэйта', () => {
    const store = configureStore({
      reducer: rootReducer,
      ...preloadedState
    });

    expect(store.getState()).toEqual(preloadedState);
  });

  test('возвращается корректный initial стэйт при неизвестном экшене', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(initialState).toEqual(preloadedState);
  });
});
