import { Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import SideBar from '../SideBar/SideBar';
import AddUserModal from './AddUserModal/AddUserModal';

import userStore from '@/stores/UserStore';
import { getUserMe } from '@/api/documentService';
import alertStore from '@/stores/AlertStore';

import styles from './contentBlock.module.css';

const ContentBlock: React.FC = observer(() => {
  const [isOpen, setIsOpen] = useState(false);
  function toggle() {
    setIsOpen(!isOpen);
  }

  useEffect(() => {
    if (userStore.token) {
      getUserMe(userStore.token)
        .then((res) => {
          userStore.setUserInfo(res);
          userStore.setIsLoggedIn(true);
        })
        .catch((error) => {
          alertStore.toggleAlert(error);
          userStore.setIsLoggedIn(false);
          userStore.deleteToken();
        });
    }
  }, [userStore.isLoggedIn]);

  return (
    <div className={styles.contentBlock}>
      <SideBar />
      <div className={styles.content}>
        <Outlet />
      </div>
      <button onClick={toggle}>Клик</button>
      <AddUserModal isOpen={isOpen} toggle={toggle} departmentId={1} />
    </div>
  );
});

export default ContentBlock;
