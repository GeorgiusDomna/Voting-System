import { Outlet, Navigate } from 'react-router-dom';
import SideBar from '../SideBar/SideBar';

import styles from './contentBlock.module.css';
import { Paths } from '@/enums/Paths';

const ContentBlock: React.FC = () => {
  const role: string = 'ADMIN'; //TODO: заменить на роль получаемую после логина

  if (!role) return <Navigate to={Paths.LOGIN} />;

  return (
    <div className={styles.contentBlock}>
      <SideBar />
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default ContentBlock;
