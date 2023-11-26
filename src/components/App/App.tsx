import { Route, Routes } from 'react-router-dom';
import ContentBlock from '../ContentBlock/ContentBlock';
import SideBar from '../SideBar/SideBar';
import Footer from '../Footer/Footer';
import Alert from '../Alert/Alert';
import { observer } from 'mobx-react-lite';
import alertStore from '@/stores/AlertStore';
import styles from './app.module.css';
import Auth from '../Auth/Auth';

const App: React.FC = observer(() => {
  const { isOpen, message, toggleAlert } = alertStore;

  return (
    <>
      <Routes>
        <Route path='/login' element={<Auth />} />
        <Route path='/registration' element={<Auth />} />
        <Route
          path='/'
          element={
            <div className={[styles.app, isOpen && styles.openAlert].join(' ')}>
              <SideBar />
              <ContentBlock />
            </div>
          }
        />
        <Route
          path='/categories/:categoryName'
          element={
            <div className={[styles.app, isOpen && styles.openAlert].join(' ')}>
              <SideBar />
              <ContentBlock />
            </div>
          }
        />
        <Route
          path='/trash'
          element={
            <div className={[styles.app, isOpen && styles.openAlert].join(' ')}>
              <SideBar />
              <ContentBlock />
            </div>
          }
        />
        <Route path='*' element={<h1>Страница не найдена</h1>} />
      </Routes>
      <Footer />
      {isOpen && <Alert message={message} toggleAlert={toggleAlert} />}
    </>
  );
});

export default App;
