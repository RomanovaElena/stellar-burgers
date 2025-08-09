import { TOrder } from '@utils-types';
import reducer, {
  createOrder,
  initialState,
  resetOrderData
} from './orders-slice';

describe('редьюсер ordersSlice - тесты синхронных и асинхронных экшнов', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('тест очистки данных заказа', () => {
    const testState = {
      ...initialState,
      orderModalData: { number: 1 } as TOrder
    };

    const newState = reducer(testState, resetOrderData());

    expect(newState.orderModalData).toBeNull();
  });

  it('тест отправки запроса createOrder.pending', () => {
    const action = { type: createOrder.pending.type };
    const newState = reducer(initialState, action);

    expect(newState.isLoading).toBe(true);
  });

  it('тест успешного запроса createOrder.fulfilled', () => {
    const testOrder = { number: 2 } as TOrder;

    const action = {
      type: createOrder.fulfilled.type,
      payload: { order: testOrder }
    };

    const newState = reducer(initialState, action);

    expect(newState.isLoading).toBe(false);
    expect(newState.orderModalData).toEqual(testOrder);
  });

  it('тест запроса с ошибкой createOrder.rejected', () => {
    const action = {
      type: createOrder.rejected.type,
      error: { message: 'ошибка при создании заказа' }
    };
    const newState = reducer(initialState, action);

    expect(newState).toEqual({
      ...initialState,
      isLoading: false,
      error: 'ошибка при создании заказа'
    });
  });
});
