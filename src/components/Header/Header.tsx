import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Paths } from '@/enums/Paths';

import userStore from '@/stores/AuthStore';
import sideBarStore from '@/stores/SideBarStore';

import styles from './header.module.css';
import greenAtomLogo from '../../assets/logoGreenColor.png';

const Header: React.FC = () => {
  const { i18n } = useTranslation();
  const [isRu, setIsRu] = useState(
    localStorage.getItem('lng') ? localStorage.getItem('lng') === 'ru' : true
  );

  const logout = () => {
    userStore.setIsLoggedIn(false);
    userStore.deleteToken();
  };

  const turnSideBar = () => {
    sideBarStore.setIsShown(!sideBarStore.isShown);
  };

  const handleClickLng = () => {
    i18n.changeLanguage(isRu ? 'en' : 'ru');
    localStorage.setItem('lng', isRu ? 'en' : 'ru');
    setIsRu(!isRu);
  };

  return (
    <header className={styles.header}>
      <a href={Paths.ROOT}>
        <img className={styles.logo} src={greenAtomLogo} alt='GreenAtom logo' />
      </a>
      <div>
        <ul className={styles.headerlist}>
          <li
            className={`${styles.header_icon} ${styles.header_icon_menu}`}
            onClick={turnSideBar}
          ></li>
          <li className={`${styles.header_icon} ${styles.header_icon_lang}`}>
            <button className={styles.lang_button} onClick={handleClickLng}></button>
          </li>
          <li
            className={`${styles.header_icon} ${styles.header_icon_logout}`}
            onClick={logout}
          ></li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
