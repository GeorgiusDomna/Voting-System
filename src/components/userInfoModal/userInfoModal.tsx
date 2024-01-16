import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import Modal from 'react-modal';

import { addUserToDepartment, deleteUser } from '@/api/userService';
import { getAllDepartments } from '@/api/departmentService';

import userStore from '@/stores/EmployeeStore';
import authStore from '@/stores/AuthStore';
import alertStore from '@/stores/AlertStore';

import IUserInfo from '@/interfaces/userInfo';
import { IDepartmentData } from '@/interfaces/IDepartmentData';

import styles from './userInfoModal.module.css';
import closeIcon from '@/assets/cancel.svg';
import blankAvatar from '@/assets/blank-avatar.png';

import { useTranslation } from 'react-i18next';
import { Localization } from '@/enums/Localization';

interface userInfoModalProps {
  isOpen: boolean;
  toggle: () => void;
  userInfo: IUserInfo;
}

const UserInfoModal: React.FC<userInfoModalProps> = ({ isOpen, toggle, userInfo }) => {
  const [departments, setDepartments] = useState<IDepartmentData[]>([]);
  const [selectedValue, setSelectedValue] = useState(userInfo.departmentId);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (authStore.token) {
          const res = await getAllDepartments(authStore.token);
          res && setDepartments(res);
        }
      } catch (err) {
        alertStore.toggleAlert((err as Error).message);
      }
    };
    fetchData();
  }, []);

  function moveHandler() {
    if (selectedValue !== userInfo.departmentId) {
      if (authStore.token) {
        addUserToDepartment(
          { userId: userInfo.id as number, departmentId: selectedValue },
          authStore.token as string
        )
          .then(() => {
            userStore.deleteUser(userInfo.id);
            toggle();
          })
          .catch((error) => {
            alertStore.toggleAlert((error as Error).message);
          });
      }
    }
  }

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
    <Modal
      isOpen={isOpen}
      contentLabel={t(`${Localization.DocumentModal}.ModalWindow`)}
      className={styles.userInfo__modal}
    >
      <div className={styles.userInfo}>
        <img src={closeIcon} className={styles.userInfo__close} onClick={toggle} />
        <div className={styles.userInfo__container}>
          <div className={styles.userInfo__info}>
            <img src={blankAvatar} alt='avatar' className={styles.userInfo__avatar} />
            <div className={styles.info}>
              <div className={styles.info_name}>
                <span>
                  <b>{t(`${Localization.UserInfoModal}.username`)}</b>
                  {userInfo.username}
                </span>
                <span>
                  <b>{t(`${Localization.UserInfoModal}.name`)}</b>
                  {userInfo.firstName}
                </span>
                <span>
                  <b>{t(`${Localization.UserInfoModal}.lastname`)}</b>
                  {userInfo.lastName}
                </span>
              </div>
              <div className={styles.info_info}>
                <span>
                  <b>{t(`${Localization.UserInfoModal}.birthday`)}</b>
                  {userInfo.birthDate}
                </span>
                <span>
                  <b>{'Email: '}</b>
                  {userInfo.email}
                </span>
              </div>
            </div>
          </div>
          <div className={styles.userInfo__controls}>
            <div className={styles.select}>
              <select
                className={styles.userInfo__select}
                value={selectedValue}
                onChange={(e) => setSelectedValue(+e.target.value)}
              >
                <option
                  key={userInfo.departmentId === null ? -1 : userInfo.departmentId}
                  value={userInfo.departmentId}
                >
                  {departments.find((el) => el.id === userInfo.departmentId)?.name ||
                    t(`${Localization.UserInfoModal}.withoutDepartment`)}
                </option>
                {departments.map((el) => {
                  if (el.id !== userInfo.departmentId) {
                    return (
                      <option key={el.id} value={el.id}>
                        {el.name}
                      </option>
                    );
                  }
                })}
                {userInfo.departmentId !== -1 && (
                  <option key={-1} value={'-1'}>
                    {t(`${Localization.UserInfoModal}.withoutDepartment`)}
                  </option>
                )}
              </select>
              <button className={styles.userInfo__button} onClick={moveHandler}>
                {t(`${Localization.UserInfoModal}.move`)}
              </button>
            </div>
            <button className={styles.userInfo__button} onClick={deleteHandler}>
              {t(`${Localization.UserInfoModal}.delete`)}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default observer(UserInfoModal);
