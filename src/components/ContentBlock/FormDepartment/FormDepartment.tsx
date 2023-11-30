import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { createNewDepartment } from '@/api/departmentService';
import styles from './formDepartment.module.css';
import alertStore from '@/stores/AlertStore';
import departmentsStore from '@/stores/DepartmentStore';
import DepartmentRequestDto from '@/interfaces/DepartmentRequestDto';

const FormDepartment: React.FC = observer(() => {
  const [newName, setNewName] = useState('');
  const [isFormEmpty, setFormEmpty] = useState(true);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!navigator.onLine) {
      alertStore.toggleAlert('Нет подключения к интернету');
      return;
    }

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

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNewName(e.target.value);
    setFormEmpty(e.target.value === '');
  }

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.formDepartment}>
        <input
          type='text'
          name='newDepartment'
          id='newDepartment'
          value={newName}
          onChange={handleInputChange}
          className={styles.inputName}
          placeholder='Название нового департамента'
        />
        <button type='submit' className={styles.btn} disabled={isFormEmpty}>
          Создать
        </button>
      </form>
    </>
  );
});

export default FormDepartment;
