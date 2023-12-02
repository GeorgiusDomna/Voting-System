import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import Modal from 'react-modal';
import styles from './deleteDepartmentModal.module.css';

import closeIcon from '@/assets/cancel.svg';

interface deleteDepartmentProps {
  departmentId: number;
  toggle: () => void;
  isOpen: boolean;
}

const AddUserModal: React.FC<deleteDepartmentProps> = observer(
  ({ isOpen, toggle, departmentId }) => {
    const [deleteUsers, setDeleteUsers] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);

    const handleDelete = () => {
      if (confirmDelete) {
        if (deleteUsers) {
          console.log('Deleting department with users...'); // TODO
        } else {
          console.log('Deleting department...'); // TODO
        }
      }
    };

    return (
      <Modal isOpen={isOpen} contentLabel='Модальное окно удаления' className={styles.modal}>
        <img src={closeIcon} className={styles.modal__close} onClick={toggle} />
        <div className={styles.form}>
          <label>Удалить пользователей вместе с департаментом</label>
          <input
            type='checkbox'
            name=''
            id=''
            checked={deleteUsers}
            onChange={() => setDeleteUsers(!deleteUsers)}
          />
          <label>Вы уверены, что хотите удалить департамент?</label>
          <input
            type='checkbox'
            name=''
            id=''
            checked={confirmDelete}
            onChange={() => setConfirmDelete(!confirmDelete)}
          />
          <button
            type='button'
            className={styles.button}
            onClick={handleDelete}
            disabled={!confirmDelete}
          >
            Удалить
          </button>
        </div>
      </Modal>
    );
  }
);

export default AddUserModal;
