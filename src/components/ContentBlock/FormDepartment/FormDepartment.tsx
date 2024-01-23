import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Localization } from '@/enums/Localization';

import alertStore from '@/stores/AlertStore';
import departmentsStore from '@/stores/DepartmentStore';

import styles from './formDepartment.module.css';

const FormDepartment: React.FC = observer(() => {
  const [newName, setNewName] = useState('');
  const { t } = useTranslation();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!navigator.onLine) {
      alertStore.toggleAlert(t(`${Localization.FormDepartment}.noInternetConnection`));
      return;
    }
    const res = await departmentsStore.createNewDepartment(newName);
    res && setNewName('');
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
