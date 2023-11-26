import { Route, Routes } from 'react-router-dom';
import ContentBlock from '../ContentBlock/ContentBlock';
import AdminControlPanel from '../ContentBlock/AdminControlPanel/AdminControlPanel';
import AdminDocumentPanel from '../ContentBlock/AdminDocumentPanel/AdminDocumentPanel';
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

const App: React.FC = observer(() => {
  const { isOpen, message, toggleAlert } = alertStore;

  const role: string = 'ADMIN'; //TODO: заменить на роль получаемую после логина

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
          <Route
            index
            element={
              role === 'ADMIN' ? (
                <AdminControlPanel />
              ) : (
                'Компонент просмотра всех документов (Юзер)'
              )
            }
          />
          <Route path={Paths.DOCUMENTS} element={<AdminDocumentPanel />} />
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
      </Routes>
      {isOpen && <Alert message={message} toggleAlert={toggleAlert} />}
    </>
  );
});

export default App;
