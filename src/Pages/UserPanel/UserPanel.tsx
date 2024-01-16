import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { Localization } from '@/enums/Localization';
import { Paths } from '@/enums/Paths';

import Loading from '@/components/ContentBlock/Loading/Loading';
import Table from '@/components/Table/Table';
import AddUserModal from '@/components/ContentBlock/AddUserModal/AddUserModal';
import DeleteDepartmentModal from '@/components/ContentBlock/DeleteDepartmentModal/DeleteDepartmentModal';

import { getDepartmentUsersByPage } from '@/api/userService';
import userStore from '@/stores/EmployeeStore';
import alertStore from '@/stores/AlertStore';
import authStore from '@/stores/AuthStore';

import style from './userPanel.module.css';
import plusIcon from '@/assets/plus.png';
import trashIcon from '@/assets/trash.svg';

const UserPanel: React.FC = () => {
  const { userPages, currentPage, setCurrentPage, paginationInfo, setPaginationInfo, setUserList } =
    userStore;
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { id, name } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (authStore.userInfo) {
      if (!authStore.isUserAdmin) navigate(Paths.ROOT);
    }
  }, [authStore.userInfo]);

  useEffect(() => {
    (async () => {
      if (id) {
        try {
          if (authStore.token && !userPages[currentPage]) {
            setIsLoading(true);
            const res = await getDepartmentUsersByPage(+id, currentPage, paginationInfo.size);
            if (res) {
              const { content, ...paginationInfo } = res;
              setUserList(content);
              setPaginationInfo(paginationInfo);
            }
          }
        } catch (err) {
          alertStore.toggleAlert((err as Error).message);
        } finally {
          setIsLoading(false);
        }
      } else {
        alertStore.toggleAlert(t(`${Localization.UserPanel}.errorAlert`));
      }
    })();
  }, [currentPage]);

  function toggle() {
    setIsOpen(!isOpen);
  }

  function toggleDeleteModal() {
    setIsDeleteModalOpen(!isDeleteModalOpen);
  }

  return (
    <div className={style.UserPanel}>
      <h2 className={style.UserPanel__title}>{decodeURIComponent(name as string)}</h2>
      <div className={style.UserPanel__controls}>
        <div className={style.UserPanel__control} onClick={toggle}>
          <img className={style.UserPanel__img} src={plusIcon} alt='+' />
          <button className={style.UserPanel__button}>
            {t(`${Localization.UserPanel}.addUserButton`)}
          </button>
        </div>
        <div className={style.UserPanel__control} onClick={toggleDeleteModal}>
          <img className={style.UserPanel__img} src={trashIcon} />
          <button className={style.UserPanel__button}>
            {t(`${Localization.UserPanel}.deleteDepartmentButton`)}
          </button>
        </div>
      </div>
      {isLoading ? (
        <Loading type={'spinningBubbles'} color={'#bdbdbd'} />
      ) : (
        <Table
          dataList={userPages}
          totalPages={paginationInfo.totalPages}
          сurrentPage={currentPage}
          setCurrentPage={setCurrentPage}
          type='user'
        />
      )}
      {id && <AddUserModal departmentId={+id} toggle={toggle} isOpen={isOpen} />}
      {id && (
        <DeleteDepartmentModal
          departmentId={+id}
          toggle={toggleDeleteModal}
          isOpen={isDeleteModalOpen}
        />
      )}
    </div>
  );
};

export default observer(UserPanel);
