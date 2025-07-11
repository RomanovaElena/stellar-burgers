import {
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder, TUser } from '@utils-types';
import { deleteCookie, setCookie } from '../../utils/cookie';

type TUserState = {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  userData: TUser | null;
  userOrders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

export const initialState: TUserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  userData: null,
  userOrders: [],
  isLoading: false,
  error: null
};

export const registerUser = createAsyncThunk(
  'user/register',
  async (data: TRegisterData, { rejectWithValue }) => {
    const response = await registerUserApi(data);
    if (!response?.success) {
      return rejectWithValue(response);
    }
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);

    return response.user;
  }
);

export const loginUser = createAsyncThunk(
  'user/login',
  async (data: TLoginData, { rejectWithValue }) => {
    const response = await loginUserApi(data);
    if (!response?.success) {
      return rejectWithValue(response);
    }
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);

    return response.user;
  }
);

export const logoutUser = createAsyncThunk(
  'user/logout',
  async () => {
    await logoutApi();
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  }
);

export const fetchUser = createAsyncThunk('users/get', async () =>
  getUserApi()
);

export const updateUser = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>, { rejectWithValue }) => {
    const response = await updateUserApi(data);
    if (!response?.success) {
      return rejectWithValue(response);
    }
    return response.user;
  }
);

export const fetchUserOrders = createAsyncThunk('users/getOrders', async () =>
  getOrdersApi()
);

const slice = createSlice({
  name: 'userSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Регистрация пользователя
      .addCase(registerUser.pending, (state) => {
        state.isAuthenticated = false;
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = action.error.message!;
      })
      // Авторизация пользователя
      .addCase(loginUser.pending, (state) => {
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.userData = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message!;
      })
      // Выход из профиля
      .addCase(logoutUser.pending, (state) => {
        state.userData = null;
        state.isAuthenticated = false;
        state.isLoading = false;
      })
      // Загрузка данных пользователя
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.userData = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.isLoading = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.userData = null;
        state.isAuthenticated = false;
        state.isLoading = false;
        state.error = action.error.message!;
      })
      //Обновление данных пользователя
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        state.userData = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message!;
      })
      // Загрузка заказов пользователя
      .addCase(fetchUserOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.userOrders = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message!;
      });
  },
  selectors: {
    getUser: (state) => state.userData,
    getUserOrders: (state) => state.userOrders,
    getLoadingStatus: (state) => state.isLoading,
    getAuthenticationStatus: (state) => state.isAuthenticated,
    getAuthCheckedStatus: (state) => state.isAuthChecked,
    getError: (state) => state.error
  }
});

export const {
  getUser,
  getUserOrders,
  getLoadingStatus,
  getAuthenticationStatus,
  getAuthCheckedStatus,
  getError
} = slice.selectors;

export default slice.reducer;
