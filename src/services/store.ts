import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import burgerConstructorSlice from './slices/burger-constructor-slice';
import ingredientsSlice from './slices/burger-ingredients-slice';
import ordersSlice from './slices/orders-slice';
import feedsSlice from './slices/feeds-slice';
import userSlice from './slices/users-slice';

export const rootReducer = combineReducers({
  burgerConstructorSlice,
  ingredientsSlice,
  ordersSlice,
  feedsSlice,
  userSlice
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
