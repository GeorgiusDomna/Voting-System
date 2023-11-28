import { Route, Routes } from 'react-router-dom';
import ContentBlock from '../ContentBlock/ContentBlock';
import DepartmentPanel from '../../Pages/DepartmentPanel/DepartmentPanel';
import Footer from '../Footer/Footer';
import Alert from '../Alert/Alert';
import { observer } from 'mobx-react-lite';
import alertStore from '@/stores/AlertStore';
import styles from './app.module.css';
import { Paths } from '@/enums/Paths';
import Auth from '../Auth/Auth';
import {
  ProtectedRouteElementForAuthorized,
  ProtectedRouteElementForUnauthorized,
} from './ProtectedRoute';
import FormLogin from '../Auth/Forms/FormLogin';
import FormRegistration from '../Auth/Forms/FormRegistration';
import DocumentPanel from '@/Pages/DocumentPanel/DocumentPanel';
import authStore from '@/stores/AuthStore';

const App: React.FC = () => {
  const { isOpen, message, toggleAlert } = alertStore;

  const role = authStore.role; /// ВРЕМЕННАЯ ЗАГЛУШКА ДЛЯ РАЗРАБОТКИ -------------------

  return (
    <>
      <Routes>
        <Route
          path={Paths.ROOT}
          element={
            <ProtectedRouteElementForUnauthorized>
              <div className={[styles.app, isOpen && styles.openAlert].join(' ')}>
                <ContentBlock />
                <Footer />
              </div>
            </ProtectedRouteElementForUnauthorized>
          }
        >
          <Route index element={role === 'ADMIN' ? <DepartmentPanel /> : <DocumentPanel />} />
          <Route path={Paths.DOCUMENTS} element={<DocumentPanel />} />
          <Route path={Paths.USER_DOCUMENTS} element={'Компонент добавления документа (Юзер)'} />
          <Route path={Paths.DOCUMENTS_VOTE} element={'Компонент голосования за документ (Юзер)'} />
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
        <Route path={Paths.ANY} element={<h1>Страница не найдена</h1>} />
      </Routes>
      {isOpen && <Alert message={message} toggleAlert={toggleAlert} />}
    </>
  );
};

export default observer(App);
