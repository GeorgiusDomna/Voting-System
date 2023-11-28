import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Outlet } from 'react-router-dom';

import SideBar from '../SideBar/SideBar';

import alertStore from '@/stores/AlertStore';
import authStore from '@/stores/AuthStore';

import { getUserMe } from '@/api/authService';

import styles from './contentBlock.module.css';

const ContentBlock: React.FC = observer(() => {
  useEffect(() => {
    if (authStore.token) {
      getUserMe(authStore.token)
        .then((res) => {
          authStore.setUserInfo(res);
          authStore.setIsLoggedIn(true);
        })
        .catch((error) => {
          alertStore.toggleAlert(error);
          authStore.setIsLoggedIn(false);
          authStore.deleteToken();
        });
    }
  }, [authStore.isLoggedIn]);

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
