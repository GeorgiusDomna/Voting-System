import styles from './header.module.css';
import greenAtomLogo from '../../assets/logoGreenColor.png';
import userStore from '@/stores/AuthStore';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const Header: React.FC = () => {
  const { i18n } = useTranslation();
  const [isRu, setIsRu] = useState(
    localStorage.getItem('lng') ? localStorage.getItem('lng') === 'ru' : true
  );
  const logout = () => {
    userStore.setIsLoggedIn(false);
    userStore.deleteToken();
  };

  const handleClickLng = (e: React.MouseEvent<HTMLButtonElement>) => {
    const lng = (e.target as HTMLButtonElement).dataset.lng;
    setIsRu(!isRu);
    if (lng) {
      i18n.changeLanguage(lng);
      localStorage.setItem('lng', lng);
    }
  };

  return (
    <header className={styles.header}>
      <div>
        <img src={greenAtomLogo} alt='GreenAtom logo' />
      </div>
      <div>
        <ul className={styles.headerlist}>
          {/*<li className={`${styles.header_icon} ${styles.header_icon_menu}`}></li>*/}
          <li className={`${styles.header_icon} ${styles.header_icon_lang}`}>
            <button
              className={styles.lang_button}
              onClick={handleClickLng}
              data-lng={isRu ? 'ru' : 'en'}
            ></button>
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