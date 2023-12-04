import LanguageSwitch from './LanguageSwitch/LanguageSwitch';
import styles from './sideBar.module.css';
import { observer } from 'mobx-react-lite';
import Navigation from './Navigation/Navigation';
import userStore from '@/stores/AuthStore';
import sideBarStore from '@/stores/SideBarStore.ts';

const SideBar: React.FC = () => {
  const logout = () => {
    userStore.setIsLoggedIn(false);
    userStore.deleteToken();
  };

  return (
    <div
      className={[styles.sideBar, sideBarStore.isShown ? styles.sideBar_shown : ''].join(' ')}
      data-testid={'SideBar'}
    >
      <Navigation />
      <LanguageSwitch />
      <button type='button' className={styles.button} onClick={logout}>
        Выход
      </button>
    </div>
  );
};

export default observer(SideBar);
