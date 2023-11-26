import { observer } from 'mobx-react-lite';
import { createNewDepartment } from '@/api/documentService';
import styles from './formDepartment.module.css';
import alertStore from '@/stores/AlertStore';
import { useState } from 'react';

const FormDepartment: React.FC = observer(() => {
  const [newDepartmentName, setNewDepartmentName] = useState('');
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const departmentParams = {
        name: newDepartmentName,
      };
      await createNewDepartment(departmentParams);
      setNewDepartmentName('');
    } catch (error) {
      alertStore.toggleAlert((error as Error).message);
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
