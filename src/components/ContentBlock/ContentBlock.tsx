import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import SideBar from '../SideBar/SideBar';
import { observer } from 'mobx-react-lite';
import styles from './contentBlock.module.css';
// import { Paths } from '@/enums/Paths';
import userStore from '@/stores/UserStore';
import { getUserMe } from '@/api/documentService';
import alertStore from '@/stores/AlertStore';

const ContentBlock: React.FC = observer(() => {
  // const role: string = 'ADMIN'; //TODO: заменить на роль получаемую после логина

  // const navigate = useNavigate();

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
    // if (!role) {
    //   navigate(Paths.LOGIN);
    // }
  }, [userStore.isLoggedIn]);

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
