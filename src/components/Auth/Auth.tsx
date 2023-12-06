import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import styles from './auth.module.css';
import { useTranslation } from 'react-i18next';
import { Localization } from '@/enums/Localization';

const Auth = () => {
  const location = useLocation();
  const navigation = useNavigate();
  const { t } = useTranslation();

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
            {t(Localization.LOGIN)}
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
            {t(Localization.REG)}
          </button>
        </div>
        <Outlet />
      </div>
    </section>
  );
};

export default Auth;
