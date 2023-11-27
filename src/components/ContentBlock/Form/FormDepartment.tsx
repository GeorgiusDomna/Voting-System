import { observer } from 'mobx-react-lite';
import { createNewDepartment } from '@/api/documentService';
import styles from './formDepartment.module.css';
import alertStore from '@/stores/AlertStore';
import { useState } from 'react';
import userStore from '@/stores/UserStore';

const FormDepartment: React.FC = observer(() => {
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const departmentParams = {
      name: newDepartmentName,
    }
    if (userStore.token) {
      createNewDepartment(departmentParams, userStore.token)
        .then(() => {
          setNewDepartmentName('');
        })
        .catch((error) => {
          alertStore.toggleAlert((error as Error).message);
        });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.formDepartment}>
        <input
          type='text'
          name='newDepartment'
          id='newDepartment'
          value={newDepartmentName}
          onChange={(e) => setNewDepartmentName(e.target.value)}
          className={styles.inputName}
          placeholder='Название нового департамента'
        />
        <button className={styles.btn}>Создать</button>
      </form>
    </>
  );
});

export default FormDepartment;
