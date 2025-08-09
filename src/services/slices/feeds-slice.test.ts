import { TOrder, TOrdersData } from '@utils-types';
import reducer, { initialState } from './feeds-slice';
import { getFeeds, getFeedById } from './feeds-slice';

describe('редьюсер feedsSlice — тесты асинхронных экшенов', () => {
  const testOrdersData: TOrdersData = {
    orders: [
      {
        _id: '1',
        ingredients: ['1', '11'],
        status: 'done',
        name: 'тестовый заказ 1',
        createdAt: '2025-08-01T10:00:00Z',
        updatedAt: '2025-08-01T10:30:00Z',
        number: 101
      }
    ],
    total: 1000,
    totalToday: 100
  };

  const testOrder: TOrder = {
    _id: '2',
    ingredients: ['222'],
    status: 'pending',
    name: 'тестовый заказ 2',
    createdAt: '2025-08-02T09:00:00Z',
    updatedAt: '2025-08-02T09:30:00Z',
    number: 102
  };

  test('тест отправки запроса getFeeds.pending', () => {
    const action = { type: getFeeds.pending.type };
    const state = reducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  test('тест успешного запроса getFeeds.fulfilled', () => {
    const action = { type: getFeeds.fulfilled.type, payload: testOrdersData };
    const state = reducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      error: null,
      ordersData: testOrdersData
    });
  });

  test('тест запроса c ошибкой getFeeds.rejected', () => {
    const action = {
      type: getFeeds.rejected.type,
      error: { message: 'ошибка получения заказов' }
    };
    const state = reducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      error: 'ошибка получения заказов'
    });
  });

  test('тест отправки запроса getFeedById.pending', () => {
    const action = { type: getFeedById.pending.type };
    const state = reducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  test('тест успешного запроса getFeedById.fulfilled', () => {
    const payload = { orders: [testOrder] };
    const action = { type: getFeedById.fulfilled.type, payload };
    const state = reducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      error: null,
      order: testOrder
    });
  });

  test('тест запроса c ошибкой getFeedById.rejected', () => {
    const action = {
      type: getFeedById.rejected.type,
      error: { message: 'ошибка получения заказа по номеру' }
    };
    const state = reducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      error: 'ошибка получения заказа по номеру'
    });
  });
});
