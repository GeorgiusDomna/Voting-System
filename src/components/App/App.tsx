import { Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import {
  ProtectedRouteElementForAuthorized,
  ProtectedRouteElementForUnauthorized,
} from './ProtectedRoute';

import authStore from '@/stores/AuthStore';
import alertStore from '@/stores/AlertStore';

import { getUserMe } from '@/api/authService';

import ContentBlock from '../ContentBlock/ContentBlock';
import DepartmentPanel from '../../Pages/DepartmentPanel/DepartmentPanel';
import DocumentTake from '@/Pages/DocumentTake/DocumentTake';
import UserPanel from '@/Pages/UserPanel/UserPanel';
import Footer from '../Footer/Footer';
import Header from '../Header/Header';
import Alert from '../Alert/Alert';
import { observer } from 'mobx-react-lite';
import { Paths } from '@/enums/Paths';
import Auth from '../Auth/Auth';
import FormLogin from '../Auth/Forms/FormLogin';
import FormRegistration from '../Auth/Forms/FormRegistration';

import DocumentPanel from '@/Pages/DocumentPanel/DocumentPanel';
import NotFoundPage from '../../Pages/NotFoundPage/NotFoundPage';

import styles from './app.module.css';

const App: React.FC = () => {
  const navigate = useNavigate();
  const { isOpen, message, toggleAlert } = alertStore;

  useEffect(() => {
    if (authStore.token) {
      getUserMe(authStore.token)
        .then((res) => {
          authStore.setUserInfo(res);
          authStore.setIsLoggedIn(true);
        })
        .catch((error) => {
          alertStore.toggleAlert(error);
          authStore.setIsLoggedIn(false);
          authStore.deleteToken();
          navigate(Paths.LOGIN);
        });
    }
  }, [authStore.isLoggedIn]);

  return (
    <>
      <Routes>
        <Route
          path={Paths.ROOT}
          element={
            <ProtectedRouteElementForUnauthorized>
              <div className={[styles.app, isOpen && styles.openAlert].join(' ')}>
                <Header />
                <ContentBlock />
                <Footer />
              </div>
            </ProtectedRouteElementForUnauthorized>
          }
        >
          <Route index element={<DocumentPanel />} />
          <Route path={`${Paths.DOCUMENTS}/:id`} element={<DocumentPanel />} />
          {authStore.isUserAdmin ? (
            <>
              <Route path={Paths.DEPARTMENTS} element={<DepartmentPanel />} />
              <Route path={`${Paths.DEPARTMENTS}/:name/:id`} element={<UserPanel />} />
            </>
          ) : (
            <>
              <Route path={Paths.DOCUMENTS_TAKE} element={<DocumentTake />} />
              <Route
                path={`${Paths.DOCUMENTS_TAKE}/:id/:appId?/:appItemId?`}
                element={<DocumentTake />}
              />
            </>
          )}
        </Route>
        <Route
          path={Paths.ROOT}
          element={
            <ProtectedRouteElementForAuthorized>
              <Auth />
            </ProtectedRouteElementForAuthorized>
          }
        >
          <Route path={Paths.LOGIN} element={<FormLogin />} />
          <Route path={Paths.REGISTRATION} element={<FormRegistration />} />
        </Route>
        <Route path={Paths.ANY} Component={NotFoundPage} />
      </Routes>
      {isOpen && <Alert message={message} toggleAlert={toggleAlert} />}
    </>
  );
};

export default observer(App);
