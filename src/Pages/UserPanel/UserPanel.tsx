import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router';

import Loading from '@/components/ContentBlock/Loading/Loading';
import Table from '@/components/Table/Table';

import { getUsersByDepartment } from '@/api/userService';
import { getUserMe } from '@/api/authService';

import userStore from '@/stores/EmployeeStore';
import alertStore from '@/stores/AlertStore';
import authStore from '@/stores/AuthStore';

import { Paths } from '@/enums/Paths';

import style from './UserPanel.module.css';

const UserPanel: React.FC = () => {
  const { userList, setUserList } = userStore;
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

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
    setIsLoading(true);
    const fetchData = async () => {
      if (authStore.isLoggedIn) {
        const res = await getUsersByDepartment(1); /// должен получать сотрудников выбранного департамента
        res && setUserList(res);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className={style.UserPanel}>
      <h2 className={style.UserPanel__title}>Работа с департаментами</h2>
      {isLoading ? (
        <Loading type={'spinningBubbles'} color={'#bdbdbd'} />
      ) : (
        <Table dataList={userList} type='user' />
      )}
    </div>
  );
};

export default observer(UserPanel);
