import { observer } from 'mobx-react-lite';
import { Outlet } from 'react-router-dom';
import SideBar from '../SideBar/SideBar';

import styles from './contentBlock.module.css';

const ContentBlock: React.FC = observer(() => {
  return (
    <div className={styles.contentBlock}>
      <SideBar />
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
});

export default ContentBlock;
