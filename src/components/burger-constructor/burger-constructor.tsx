import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  getLoadingStatus,
  getOrderModalData,
  resetOrderData
} from '../../services/slices/orders-slice';
import { getUser } from '../../services/slices/users-slice';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../../services/slices/orders-slice';
import { resetConstructor } from '../../services/slices/burger-constructor-slice';

export const BurgerConstructor: FC = () => {
  const constructorItems = useSelector((state) => state.burgerConstructorSlice);
  const orderRequest = useSelector(getLoadingStatus);
  const orderModalData = useSelector(getOrderModalData);
  const user = useSelector(getUser);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) {
      return navigate('/login');
    }

    const orderData: string[] = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ingredient) => ingredient._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(orderData));
  };

  const closeOrderModal = () => {
    dispatch(resetConstructor());
    navigate('/', { replace: true });
    dispatch(resetOrderData());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
