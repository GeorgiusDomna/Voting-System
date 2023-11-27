import styles from './adminControlPanel.module.css';
import FormDepartment from '../Form/FormDepartment';
import DepartmentItem from './DepartmentItem/DepartmentItem';
import { observer } from 'mobx-react-lite';
import { departaments } from '@/dataBase/departaments';
// import { useState, useEffect } from 'react';

const AdminControlPanel: React.FC = observer(() => {
  const listDepartment = departaments;

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
