import { Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Paths } from '@/enums/Paths';
import authStore from '@/stores/AuthStore';

export const ProtectedRouteElementForUnauthorized = observer(
  ({ children }: { children: JSX.Element }) => {
    return authStore.isLoggedIn ? children : <Navigate to={Paths.LOGIN} replace />;
  }
);

export const ProtectedRouteElementForAuthorized = observer(
  ({ children }: { children: JSX.Element }) => {
    return authStore.isLoggedIn ? <Navigate to={Paths.ROOT} replace /> : children;
  }
);
