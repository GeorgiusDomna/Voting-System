import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { createNewDepartment } from '@/api/departmentService';
import styles from './formDepartment.module.css';
import alertStore from '@/stores/AlertStore';
import authStore from '@/stores/AuthStore';
import departmentsStore from '@/stores/DepartmentStore';
import DepartmentRequestDto from '@/interfaces/DepartmentRequestDto';
import { useTranslation } from 'react-i18next';
import { Localization } from '@/enums/Localization';

const FormDepartment: React.FC = observer(() => {
  const [newName, setNewName] = useState('');
  const { t } = useTranslation();
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!navigator.onLine) {
      alertStore.toggleAlert(t(`${Localization.FormDepartment}.noInternetConnection`));
      return;
    }

    const newDep: DepartmentRequestDto = {
      name: newName,
    };

    if (authStore.token) {
      createNewDepartment(newDep, authStore.token)
        .then((data) => {
          departmentsStore.addNewDepartment(data);
          setNewName('');
        })
        .catch((error) => {
          alertStore.toggleAlert((error as Error).message);
        });
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNewName(e.target.value);
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
          placeholder={t(`${Localization.FormDepartment}.newDepartmentPlaceholder`)}
        />
        <button type='submit' className={styles.btn} disabled={!newName}>
          {t(`${Localization.FormDepartment}.createButton`)}
        </button>
      </form>
    </>
  );
});

export default FormDepartment;
