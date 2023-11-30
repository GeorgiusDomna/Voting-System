import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate, useParams, useLocation } from 'react-router';

import Loading from '@/components/ContentBlock/Loading/Loading';
import Table from '@/components/Table/Table';
import AddUserModal from '@/components/ContentBlock/AddUserModal/AddUserModal';

import { getUsersByDepartment } from '@/api/userService';
import { getUserMe } from '@/api/authService';

import userStore from '@/stores/EmployeeStore';
import alertStore from '@/stores/AlertStore';
import authStore from '@/stores/AuthStore';

import { Paths } from '@/enums/Paths';

import plusIcon from '@/assets/plus.png';
import style from './userPanel.module.css';

const UserPanel: React.FC = () => {
  const { userList, setUserList } = userStore;
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    if (authStore.token) {
      getUserMe(authStore.token)
        .then((res) => {
          authStore.setUserInfo(res);
          if (!authStore.isUserAdmin) navigate(Paths.ROOT);
        })
        .catch((error) => {
          alertStore.toggleAlert(error);
          authStore.deleteToken();
        });
    }
  }, [authStore.isLoggedIn]);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        if (authStore.isLoggedIn) {
          const res = await getUsersByDepartment(+id);
          res && setUserList(res);
        }
      } else {
        alertStore.toggleAlert('Ошибка');
        setIsLoading(false);
      }
      setIsLoading(false);
    };
    setIsLoading(true);
    fetchData();
  }, [id]);

  function toggle() {
    setIsOpen(!isOpen);
  }

  return (
    <div className={style.UserPanel}>
      <h2 className={style.UserPanel__title}>{state.name}</h2>
      <div className={style.UserPanel__controls} onClick={toggle}>
        <img className={style.UserPanel__img} src={plusIcon} alt='+' />
        <button className={style.UserPanel__button}>Добавить пользователя</button>
      </div>
      {isLoading ? (
        <Loading type={'spinningBubbles'} color={'#bdbdbd'} />
      ) : (
        <Table dataList={userList} type='user' />
      )}
      {id && <AddUserModal departmentId={+id} toggle={toggle} isOpen={isOpen} />}
    </div>
  );
};

export default observer(UserPanel);
