import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Paths } from '@/enums/Paths';
import Modal from 'react-modal';

import alertStore from '@/stores/AlertStore';
import departmentsStore from '@/stores/DepartmentStore';

import styles from './deleteDepartmentModal.module.css';
import closeIcon from '@/assets/cancel.svg';

interface deleteDepartmentProps {
  departmentId: number;
  toggle: () => void;
  isOpen: boolean;
}

const AddUserModal: React.FC<deleteDepartmentProps> = ({ isOpen, toggle, departmentId }) => {
  const { deleteUsersByDepart, deleteDepart } = departmentsStore;
  const [deleteUsers, setDeleteUsers] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!navigator.onLine) {
      alertStore.toggleAlert('Нет подключения к интернету');
      return;
    }
    if (confirmDelete) {
      deleteUsers && deleteUsersByDepart(departmentId);
      const res = await deleteDepart(departmentId);
      res && navigate(Paths.DEPARTMENTS), toggle();
    }
  };

  return (
    <Modal isOpen={isOpen} contentLabel='Модальное окно удаления' className={styles.modal}>
      <img src={closeIcon} className={styles.modal__close} onClick={toggle} />
      <div className={styles.form}>
        <div className={styles.question}>
          <label>Удалить пользователей вместе с департаментом</label>
          <input
            type='checkbox'
            className={styles.checkboxInput}
            checked={deleteUsers}
            onChange={() => setDeleteUsers(!deleteUsers)}
          />
        </div>
        <br />
        <div className={styles.question}>
          <label>Вы уверены, что хотите удалить департамент?</label>
          <input
            type='checkbox'
            className={styles.checkboxInput}
            checked={confirmDelete}
            onChange={() => setConfirmDelete(!confirmDelete)}
          />
        </div>
      </div>
      <button
        type='button'
        className={styles.button}
        onClick={handleDelete}
        disabled={!confirmDelete}
      >
        Удалить
      </button>
    </Modal>
  );
};

export default observer(AddUserModal);
