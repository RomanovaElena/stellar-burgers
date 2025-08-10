import { TIngredient } from '@utils-types';
import reducer, {
  addIngredient,
  deleteIngredient,
  initialState,
  moveIngredient,
  resetConstructor,
  TConstructorState
} from './burger-constructor-slice';

describe('редьюсер burgerConstructor - тесты синхронных экшенов', () => {
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

  const testState: TConstructorState = {
    bun: null,
    ingredients: [
      { ...testSauce, id: '1' },
      { ...testMain, id: '2' }
    ]
  };

  test('тест добавления ингредиента-булки', () => {
    const newState = reducer(initialState, addIngredient(testBun));

    expect(newState.bun).toMatchObject(testBun);
    expect(newState.ingredients.length).toBe(0);
  });

  test('тест добавления ингредиента-начинки', () => {
    const newState = reducer(initialState, addIngredient(testSauce));

    expect(newState.ingredients[0]).toMatchObject(testSauce);
    expect(newState.ingredients.length).toBe(1);
    expect(newState.bun).toBe(null);
  });

test('тест добавления ингредиента-начинки в не пустой конструктор', () => {
  const stateWithOneIngredient: TConstructorState = {
    bun: null,
    ingredients: [{ ...testMain, id: 'old' }]
  };

  const newState = reducer(stateWithOneIngredient, addIngredient(testSauce));

  expect(newState.ingredients.length).toBe(2);
  expect(newState.ingredients[0].id).toBe('old');
  expect(newState.ingredients[1]).toMatchObject(testSauce);
  expect(newState.ingredients[1].id).toBeDefined();
});

it('тест замены булки при добавлении новой булки в конструктор', () => {
  const stateWithBun: TConstructorState = {
    bun: { ...testBun, _id: 'old' },
    ingredients: []
  };

  const newBun: TIngredient = {
    ...testBun,
    _id: 'new',
    name: 'New Bun'
  };

  const newState = reducer(stateWithBun, addIngredient(newBun));

  expect(newState.bun).toMatchObject(newBun);
  expect(newState.bun?._id).toBe('new');
  expect(newState.ingredients.length).toBe(0);
});

  test('тест удаления ингредиента', () => {
    const newState = reducer(testState, deleteIngredient('1'));

    expect(newState.ingredients.length).toBe(1);
    expect(newState.ingredients[0].id).toBe('2');
  });

  test('тест перемещения ингредиента вверх', () => {
    const newState = reducer(
      testState,
      moveIngredient({ index: 1, upwards: true })
    );

    expect(newState.ingredients[0].id).toBe('2');
    expect(newState.ingredients[1].id).toBe('1');
  });

  test('тест перемещения ингредиента вниз', () => {
    const newState = reducer(
      testState,
      moveIngredient({ index: 0, upwards: false })
    );

    expect(newState.ingredients[0].id).toBe('2');
    expect(newState.ingredients[1].id).toBe('1');
  });

  test('тест очистки конструктора', () => {
    const state: TConstructorState = {
      bun: testBun,
      ingredients: [
        { ...testSauce, id: '1' },
        { ...testMain, id: '2' }
      ]
    };
    const newState = reducer(testState, resetConstructor());
    expect(newState).toEqual(initialState);
  });
});
