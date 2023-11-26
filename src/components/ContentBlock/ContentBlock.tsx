import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import SideBar from '../SideBar/SideBar';

import styles from './contentBlock.module.css';
import { Paths } from '@/enums/Paths';

const ContentBlock: React.FC = () => {
  const role: string = 'ADMIN'; //TODO: заменить на роль получаемую после логина

  const navigate = useNavigate();

  useEffect(() => {
    if (!role) {
      navigate(Paths.LOGIN);
    }
  }, [role, navigate]);

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
