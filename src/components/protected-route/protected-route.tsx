import { FC } from 'react';
import {
  getAuthCheckedStatus,
  getLoadingStatus,
  getUser
} from '../../services/slices/users-slice';
import { useDispatch, useSelector } from '../../services/store';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';

type TProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute: FC<TProtectedRouteProps> = ({
  onlyUnAuth = false,
  children
}) => {
  const isAuthChecked = useSelector(getAuthCheckedStatus);
  const user = useSelector(getUser);
  const location = useLocation();

  // if (!isAuthChecked && isLoading) {
  if (!isAuthChecked) {
    return <Preloader />;
  }
  // Автотризация не выполнена
  if (!onlyUnAuth && !user) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }
  // Авторизация выполнена
  if (onlyUnAuth && user) {
    const { from } = location.state ?? { from: { pathname: '/' } };
    return <Navigate replace to={from} state={location} />;
  }
  return children;
};
