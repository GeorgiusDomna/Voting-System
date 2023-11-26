import { Navigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import userStore from '@/stores/UserStore';
import { Paths } from '@/enums/Paths';

export const ProtectedRouteElementForUnauthorized = observer(
  ({ children }: { children: JSX.Element }) => {
    return userStore.isLoggedIn ? children : <Navigate to={Paths.LOGIN} replace />;
  }
);

export const ProtectedRouteElementForAuthorized = observer(
  ({ children }: { children: JSX.Element }) => {
    return userStore.isLoggedIn ? <Navigate to={Paths.ROOT} replace /> : children;
  }
);
