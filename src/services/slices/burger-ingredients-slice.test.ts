import { TIngredient } from '@utils-types';
import reducer, { initialState } from './burger-ingredients-slice';
import { fetchIngredients } from './burger-ingredients-slice';

describe('редьюсер ingredientsSlice - тесты асинхронных экшнов', () => {
  const testSauce: TIngredient = {
    _id: '1',
    name: 'Sauce',
    type: 'sauce',
    proteins: 0,
    fat: 40,
    carbohydrates: 5,
    calories: 500,
    price: 15,
    image: '',
    image_large: '',
    image_mobile: ''
  };

  const testMain: TIngredient = {
    _id: '2',
    name: 'Main',
    type: 'main',
    proteins: 20,
    fat: 5,
    carbohydrates: 0,
    calories: 300,
    price: 550,
    image: '',
    image_large: '',
    image_mobile: ''
  };

  const testBun: TIngredient = {
    _id: '3',
    name: 'Bun',
    type: 'bun',
    proteins: 5,
    fat: 5,
    carbohydrates: 30,
    calories: 150,
    price: 25,
    image: '',
    image_large: '',
    image_mobile: ''
  };
  const testIngredients: TIngredient[] = [testBun, testSauce, testMain];

  test('тест отправки запроса fetchIngregients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = reducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  test('тест успешного запроса fetchIngregients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: testIngredients
    };
    const state = reducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      ingredients: testIngredients,
      isLoading: false,
      error: null
    });
  });

  test('тест запроса c ошибкой fetchIngregients.rejected', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: 'ошибка получения данных' }
    };
    const state = reducer(initialState, action);

    expect(state).toEqual({
      ...initialState,
      isLoading: false,
      error: 'ошибка получения данных'
    });
  });
});
