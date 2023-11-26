import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import styles from './auth.module.css';

const Auth = () => {
  const location = useLocation();
  const navigation = useNavigate();

  const toggleTab = () => {
    if (location.pathname === '/login') {
      navigation('/registration');
    } else if (location.pathname === '/registration') {
      navigation('/login');
    }
  };

  return (
    <section className={styles.auth}>
      <div className={styles.authContainer}>
        <div className={styles.tab}>
          <button
            type='button'
            className={[
              styles.button,
              styles.button_type_tabLogin,
              `${location.pathname === '/login' ? styles.button_active : ''}`,
            ].join(' ')}
            onClick={toggleTab}
          >
            Войти
          </button>
          <button
            type='button'
            className={[
              styles.button,
              styles.button_type_tabReg,
              `${location.pathname === '/registration' ? styles.button_active : ''}`,
            ].join(' ')}
            onClick={toggleTab}
          >
            Регистрация
          </button>
        </div>
        <Outlet />
      </div>
    </section>
  );
};

export default Auth;
