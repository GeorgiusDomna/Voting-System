import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import Loading from '@/components/ContentBlock/Loading/Loading';
import Table from '@/components/Table/Table';

import { getUsersByDepartment } from '@/api/userService';

import userStore from '@/stores/UserStore';

import style from './UserPanel.module.css';
import authStore from '@/stores/AuthStore';

const UserPanel: React.FC = () => {
  const { userList, setUserList } = userStore;
  const [isLoading, setIsLoading] = useState(false);

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
  }, [authStore.isLoggedIn]);

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
