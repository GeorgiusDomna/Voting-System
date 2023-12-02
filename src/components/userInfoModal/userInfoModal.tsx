import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import Modal from 'react-modal';

import { addUserToDepartment, deleteUser } from '@/api/userService';

import userStore from '@/stores/EmployeeStore';
import authStore from '@/stores/AuthStore';
import alertStore from '@/stores/AlertStore';

import IUserInfo from '@/interfaces/userInfo';

import styles from './userInfoModal.module.css';
import closeIcon from '@/assets/cancel.svg';
import blankAvatar from '@/assets/blank-avatar.png';

interface userInfoModalProps {
  isOpen: boolean;
  toggle: () => void;
  userInfo: IUserInfo;
}

const userInfoModal: React.FC<userInfoModalProps> = ({ isOpen, toggle, userInfo }) => {
  function deleteHandler() {
    if (authStore.token) {
      deleteUser(userInfo.id, authStore.token)
        .then(() => {
          userStore.deleteUser(userInfo.id);
          toggle();
        })
        .catch((error) => {
          alertStore.toggleAlert((error as Error).message);
        });
    }
  }

  return (
    <Modal isOpen={isOpen} contentLabel='Модальное окно' className={styles.userInfo__modal}>
      <img src={closeIcon} className={styles.userInfo__close} onClick={toggle} />
      <div className={styles.userInfo__container}>
        <div className={styles.userInfo__info}>
          <img src={blankAvatar} alt='avatar' />
          <div className={styles.info}>
            <span>{`Username: ${userInfo.username}`}</span>
            <span>{`Name: ${userInfo.firstName}`}</span>
            <span>{`Lastname: ${userInfo.lastName}`}</span>
            <span>{`Birthday: ${userInfo.birthDate}`}</span>
            <span>{`Email: ${userInfo.email}`}</span>
          </div>
        </div>
        <div className={styles.userInfo__controls}>
          <select className={styles.userInfo__select}></select>
          <button className={styles.userInfo__button} onClick={deleteHandler}>
            Удалить
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default observer(userInfoModal);
