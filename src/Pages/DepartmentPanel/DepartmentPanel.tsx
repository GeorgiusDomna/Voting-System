import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import Loading from '@/components/ContentBlock/Loading/Loading';
import Table from '@/components/Table/Table';

import { getAllDepartments } from '@/api/departmentService';
import departmentsStore from '@/stores/DepartmentStore';
import authStore from '@/stores/AuthStore';

import style from './departmentPanel.module.css';

const DepartmentPanel: React.FC = () => {
  const { departmentList, setDepartments } = departmentsStore;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      if (authStore.isLoggedIn) {
        const res = await getAllDepartments();
        res && setDepartments(res);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [authStore.isLoggedIn]);

  return (
    <div className={style.DepartmentPanel}>
      <h2 className={style.DepartmentPanel__title}>Работа с департаментами</h2>
      {isLoading ? (
        <Loading type={'spinningBubbles'} color={'#bdbdbd'} />
      ) : (
        <Table dataList={departmentList} type='department' />
      )}
    </div>
  );
};

export default observer(DepartmentPanel);
