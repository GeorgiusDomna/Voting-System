import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import SideBar from '../SideBar/SideBar';

import AddUserModal from './AddUserModal/AddUserModal';

import styles from './contentBlock.module.css';
import { Paths } from '@/enums/Paths';

const ContentBlock: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  function toggle() {
    setIsOpen(!isOpen);
  }

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
      <button onClick={toggle}>Клик</button>
      <AddUserModal isOpen={isOpen} toggle={toggle} departmentId={1} />
    </div>
  );
};

export default ContentBlock;
