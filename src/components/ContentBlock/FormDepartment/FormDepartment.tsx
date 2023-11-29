import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { createNewDepartment } from '@/api/departmentService';
import styles from './formDepartment.module.css';
import alertStore from '@/stores/AlertStore';
import departmentsStore from '@/stores/DepartmentStore';
import DepartmentRequestDto from '@/interfaces/DepartmentRequestDto';

const FormDepartment: React.FC = observer(() => {
  const [newName, setNewName] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newDep: DepartmentRequestDto = {
      name: newName,
    };

    createNewDepartment(newDep)
      .then((data) => {
        departmentsStore.addNewDepartment(data);
        setNewName('');
      })
      .catch((error) => {
        alertStore.toggleAlert((error as Error).message);
      });
  }

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.formDepartment}>
        <input
          type='text'
          name='newDepartment'
          id='newDepartment'
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className={styles.inputName}
          placeholder='Название нового департамента'
        />
        <button type='submit' className={styles.btn}>
          Создать
        </button>
      </form>
    </>
  );
});

export default FormDepartment;
