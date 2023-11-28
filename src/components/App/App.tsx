import { Route, Routes } from 'react-router-dom';
import ContentBlock from '../ContentBlock/ContentBlock';
import AdminControlPanel from '../ContentBlock/AdminControlPanel/AdminControlPanel';
import DocumentPanel from '../ContentBlock/DocumentPanel/DocumentPanel';
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
          <Route index element={<DocumentPanel />} />
          <Route path={Paths.ADMIN_PANEL} element={<AdminControlPanel />} />
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
});

export default App;
