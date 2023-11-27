import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import SideBar from '../SideBar/SideBar';
import { observer } from 'mobx-react-lite';

import AddUserModal from './AddUserModal/AddUserModal';

import styles from './contentBlock.module.css';
import userStore from '@/stores/UserStore';
import { getUserMe } from '@/api/documentService';
import alertStore from '@/stores/AlertStore';

const ContentBlock: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  function toggle() {
    setIsOpen(!isOpen);
  }

  const role: string = 'ADMIN'; //TODO: заменить на роль получаемую после логина

  const navigate = useNavigate();

const ContentBlock: React.FC = observer(() => {
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
