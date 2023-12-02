import { useState } from 'react';
import LanguageSwitch from './LanguageSwitch/LanguageSwitch';
import SideBarButton from './SideBarButton/SideBarButton';
import styles from './sideBar.module.css';
import { observer } from 'mobx-react-lite';
import Navigation from './Navigation/Navigation';
import userStore from '@/stores/AuthStore';

const SideBar: React.FC = () => {
  const [isShown, setIsShown] = useState(false);

  function clickHandler() {
    setIsShown(!isShown);
  }

  const logout = () => {
    userStore.setIsLoggedIn(false);
    userStore.deleteToken();
  };

  return (
    <div
      className={[styles.sideBar, isShown ? styles.sideBar_shown : ''].join(' ')}
      data-testid={'SideBar'}
    >
      <Navigation />
      <SideBarButton clickHandler={clickHandler} />
      <LanguageSwitch />
      <button type='button' className={styles.button} onClick={logout}>
        Выход
      </button>
    </div>
  );
};

export default observer(SideBar);
