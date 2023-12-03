import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import Modal from 'react-modal';
import styles from './deleteDepartmentModal.module.css';

import { deleteDepartment } from '@/api/departmentService';
import { deleteUser, getUsersByDepartment } from '@/api/userService';

import closeIcon from '@/assets/cancel.svg';
import authStore from '@/stores/AuthStore';
import alertStore from '@/stores/AlertStore';
import { useNavigate } from 'react-router-dom';
import { Paths } from '@/enums/Paths';
import IUserInfo from '@/interfaces/userInfo';

interface deleteDepartmentProps {
  departmentId: number;
  toggle: () => void;
  isOpen: boolean;
}

const AddUserModal: React.FC<deleteDepartmentProps> = observer(
  ({ isOpen, toggle, departmentId }) => {
    const [deleteUsers, setDeleteUsers] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const navigate = useNavigate();

    const handleDelete = () => {
      if (authStore.token) {
        if (confirmDelete) {
          if (deleteUsers) {
            getUsersByDepartment(authStore.token, departmentId)
              .then((data) => {
                const userArr = data as IUserInfo[];
                userArr.forEach((user) => {
                  deleteUser(user.id as number, authStore.token as string).catch((error) => {
                    alertStore.toggleAlert((error as Error).message);
                  });
                });
              })
              .catch((error) => {
                alertStore.toggleAlert((error as Error).message);
              });
          }
          deleteDepartment(departmentId as number, authStore.token as string)
            .then(() => {
              alertStore.toggleAlert('Успешно удалено');
              toggle();
              navigate(Paths.DEPARTMENTS);
            })
            .catch((error) => {
              alertStore.toggleAlert((error as Error).message);
            });
        }
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
  }
);

export default AddUserModal;
