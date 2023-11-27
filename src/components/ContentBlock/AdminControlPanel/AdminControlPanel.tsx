import styles from './adminControlPanel.module.css';
import FormDepartment from '../Form/FormDepartment';
import DepartmentItem from './DepartmentItem/DepartmentItem';
import { observer } from 'mobx-react-lite';
import userStore from '@/stores/UserStore';
import { useState } from 'react';
import { getAllDepartments } from '@/api/documentService';
import alertStore from '@/stores/AlertStore';

const AdminControlPanel: React.FC = observer(() => {
  const [listDepartment, setListDepartment] = useState([]);

  if (userStore.token) {
    getAllDepartments(userStore.token)
      .then((data) => {
        setListDepartment(data);
      })
      .catch((error) => {
        alertStore.toggleAlert((error as Error).message);
      });
  }

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
