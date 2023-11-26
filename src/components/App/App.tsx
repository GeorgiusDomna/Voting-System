import { Route, Routes } from 'react-router-dom';
import ContentBlock from '../ContentBlock/ContentBlock';
import UserControlPanel from '../UserControlPanel/UserControlPanel';
import SideBar from '../SideBar/SideBar';
import Footer from '../Footer/Footer';
import Alert from '../Alert/Alert';
import { observer } from 'mobx-react-lite';
import alertStore from '@/stores/AlertStore';
import styles from './app.module.css';

const App: React.FC = observer(() => {
  const { isOpen, message, toggleAlert } = alertStore;

  const role: string = 'ADMIN'; //TODO: заменить на роль получаемую после логина

  return (
    <>
      <div className={[styles.app, isOpen && styles.openAlert].join(' ')}>
        <SideBar />
        <Routes>
          <Route path='/' element={<ContentBlock />}>
            <Route
              index
              element={
                role === 'ADMIN' ? (
                  <UserControlPanel />
                ) : (
                  'Компонент просмотра всех документов (Юзер)'
                )
              }
            />
            <Route path='/departaments' element={'Компонент добавления департамента (Админ)'} />
            <Route path='/create-document' element={'Компонент добавления документа (Юзер)'} />
            <Route path='/documents-vote' element={'Компонент голосования за документ (Юзер)'} />
          </Route>
          <Route path='/login' element={'Компонент авторизации (для незалогинившихся)'} />
        </Routes>
        <Footer />
      </div>
      {isOpen && <Alert message={message} toggleAlert={toggleAlert} />}
    </>
  );
});

export default App;
