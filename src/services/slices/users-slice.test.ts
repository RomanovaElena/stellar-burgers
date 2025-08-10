import { TUser, TOrder } from '@utils-types';
import reducer, {
  fetchUser,
  fetchUserOrders,
  initialState,
  loginUser,
  logoutUser,
  registerUser,
  resetError,
  setIsAuthChecked,
  updateUser
} from './users-slice';

describe('редьюсер userSlice - тесты синхронных и асинхронных экшнов', () => {

  const testUser = { name: 'Елена', email: 'romanova@ggmail.com' } as TUser;

  test('тест установки флага авторизации setIsAuthChecked', () => {
    const newState = reducer(initialState, setIsAuthChecked(true));
    expect(newState.isAuthChecked).toBe(true);
  });

  test('тест сброса ошибки resetError', () => {
    const errorState = { ...initialState, error: 'ошибка' };
    const newState = reducer(errorState, resetError());
    expect(newState.error).toBeNull();
  });

  // регистрация пользователя
  test('тест отправки запроса registerUser.pending', () => {
    const newState = reducer(initialState, {
      type: registerUser.pending.type
    });
    expect(newState.isLoading).toBe(true);
  });

  test('тест успешного запроса registerUser.fulfilled', () => {
    const newState = reducer(initialState, {
      type: registerUser.fulfilled.type,
      payload: testUser
    });

    expect(newState.isLoading).toBe(false);
    expect(newState.isAuthChecked).toBe(true);
    expect(newState.userData).toEqual(testUser);
  });

  test('тест запроса с ошибкой registerUser.rejected', () => {
    const newState = reducer(initialState, {
      type: registerUser.rejected.type,
      error: { message: 'ошибка регистрации' }
    });

    expect(newState.isLoading).toBe(false);
    expect(newState.error).toBe('ошибка регистрации');
  });

  // авторизация пользователя
  test('тест отправки запроса loginUser.pending', () => {
    const newState = reducer(initialState, { type: loginUser.pending.type });
    expect(newState.isLoading).toBe(true);
  });

  test('тест успешного запроса loginUser.fulfilled', () => {
    const newState = reducer(initialState, {
      type: loginUser.fulfilled.type,
      payload: testUser
    });

    expect(newState.userData).toEqual(testUser);
    expect(newState.isAuthChecked).toBe(true);
    expect(newState.isLoading).toBe(false);
  });

  test('тест запроса с ошибкой loginUser.rejected', () => {
    const newState = reducer(initialState, {
      type: loginUser.rejected.type,
      error: { message: 'неверные учетные данные' }
    });

    expect(newState.isLoading).toBe(false);
    expect(newState.error).toBe('неверные учетные данные');
  });

  // выход из профиля
  test('тест отправки запроса logoutUser.pending', () => {
    const testStateWithUser = {
      ...initialState,
     userData: testUser
    };

    const newState = reducer(testStateWithUser, {
      type: logoutUser.pending.type
    });

    expect(newState.userData).toBeNull();
    expect(newState.isLoading).toBe(false);
  });

  // получение данных пользователя
  test('тест отправки запроса fetchUser.pending', () => {
    const newState = reducer(initialState, { type: fetchUser.pending.type });
    expect(newState.isLoading).toBe(true);
  });

  test('тест успешного запроса fetchUser.fulfilled', () => {
    const newState = reducer(initialState, {
      type: fetchUser.fulfilled.type,
      payload: {user: testUser}
    });

    expect(newState.userData).toEqual(testUser);
    expect(newState.isAuthChecked).toBe(true);
    expect(newState.isLoading).toBe(false);
  });

  test('тест запроса с ошибкой fetchUser.rejected', () => {
    const newState = reducer(initialState, {
      type: fetchUser.rejected.type,
      error: { message: 'пользователь не авторизован' }
    });

    expect(newState.userData).toBeNull();
    expect(newState.error).toBe('пользователь не авторизован');
    expect(newState.isLoading).toBe(false);
  });

  // обновление данных пользователя
  test('тест успешного запроса updateUser.fulfilled', () => {
    const newState = reducer(initialState, {
      type: updateUser.fulfilled.type,
      payload: testUser
    });

    expect(newState.userData).toEqual(testUser);
    expect(newState.isLoading).toBe(false);
    expect(newState.isAuthChecked).toBe(true);
  });

  test('тест запроса с ошибкой updateUser.rejected', () => {
    const newState = reducer(initialState, {
      type: updateUser.rejected.type,
      error: { message: 'ошибка обновления данных' }
    });

    expect(newState.error).toBe('ошибка обновления данных');
    expect(newState.isLoading).toBe(false);
  });

  // получение заказов пользователя
  test('тест успешного запроса fetchUserOrders.fulfilled', () => {
    const orders = [{ number: 1 }, { number: 2 }] as TOrder[];
    const newState = reducer(initialState, {
      type: fetchUserOrders.fulfilled.type,
      payload: orders
    });

    expect(newState.userOrders).toEqual(orders);
    expect(newState.isLoading).toBe(false);
  });

  test('тест запроса с ошибкой fetchUserOrders.rejected', () => {
    const newState = reducer(initialState, {
      type: fetchUserOrders.rejected.type,
      error: { message: 'ошибка получения заказов пользователя' }
    });

    expect(newState.error).toBe('ошибка получения заказов пользователя');
    expect(newState.isLoading).toBe(false);
  });
});
