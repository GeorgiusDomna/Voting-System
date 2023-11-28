import FormDepartment from '../FormDepartment/FormDepartment';
import DepartmentItem from './DepartmentItem/DepartmentItem';
import { observer } from 'mobx-react-lite';
import userStore from '@/stores/UserStore';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getAllDepartments, getUserMe } from '@/api/documentService';
import alertStore from '@/stores/AlertStore';
import DepartmentResponseDto from '@/interfaces/DepartmentResponseDto';
import { Paths } from '@/enums/Paths';
import styles from './adminControlPanel.module.css';

const AdminControlPanel: React.FC = observer(() => {
  const [listDepartment, setListDepartment] = useState<DepartmentResponseDto[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (userStore.token) {
      getUserMe(userStore.token)
        .then((res) => {
          userStore.setUserInfo(res);
          userStore.setIsLoggedIn(true);
          if (!userStore.isUserAdmin) navigate(Paths.ROOT);
        })
        .catch((error) => {
          alertStore.toggleAlert(error);
          userStore.setIsLoggedIn(false);
          userStore.deleteToken();
        });
    }
  }, [userStore.isLoggedIn]);

  useEffect(() => {
    if (userStore.token) {
      getAllDepartments(userStore.token)
        .then((data) => {
          setListDepartment(data);
        })
        .catch((error) => {
          alertStore.toggleAlert((error as Error).message);
        });
    }
  });

  return (
    <div className={styles.contentBlock}>
      <h2 className={styles.title}>Департаменты</h2>
      <div className={styles.form}>
        <FormDepartment></FormDepartment>
      </div>
      <div className={styles.listDepartment}>
        {listDepartment.map((item) => (
          <DepartmentItem key={item.id} id={item.id} name={item.name} />
        ))}
      </div>
    </div>
  );
});

export default AdminControlPanel;
