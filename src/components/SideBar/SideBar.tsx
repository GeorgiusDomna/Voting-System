import styles from './sideBar.module.css';
import { observer } from 'mobx-react-lite';
import Navigation from './Navigation/Navigation';
import sideBarStore from '@/stores/SideBarStore.ts';

const SideBar: React.FC = () => {
  return (
    <div
      className={[styles.sideBar, sideBarStore.isShown ? styles.sideBar_shown : ''].join(' ')}
      data-testid={'SideBar'}
    >
      <Navigation />
    </div>
  );
};

export default observer(SideBar);
