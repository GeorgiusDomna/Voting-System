import { useState } from 'react';
import LanguageSwitch from './LanguageSwitch/LanguageSwitch';
import SideBarButton from './SideBarButton/SideBarButton';
import styles from './sideBar.module.css';
import { observer } from 'mobx-react-lite';
import Navigation from './Navigation/Navigation';

const SideBar: React.FC = observer(() => {
  const [isShown, setIsShown] = useState(false);

  function clickHandler() {
    setIsShown(!isShown);
  }

  return (
    <div
      className={[styles.sideBar, isShown ? styles.sideBar_shown : ''].join(' ')}
      data-testid={'SideBar'}
    >
      <Navigation />
      <SideBarButton clickHandler={clickHandler} />
      <LanguageSwitch />
    </div>
  );
});

export default SideBar;
