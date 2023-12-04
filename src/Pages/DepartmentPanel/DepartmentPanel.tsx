import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Loading from '@/components/ContentBlock/Loading/Loading';
import Table from '@/components/Table/Table';
import FormDepartment from '@/components/ContentBlock/FormDepartment/FormDepartment';
import { getAllDepartments } from '@/api/departmentService';
import departmentsStore from '@/stores/DepartmentStore';
import authStore from '@/stores/AuthStore';
import alertStore from '@/stores/AlertStore';
import style from './departmentPanel.module.css';
import { Paths } from '@/enums/Paths';

const DepartmentPanel: React.FC = () => {
  const { departmentList, setDepartments } = departmentsStore;
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (authStore.userInfo) {
      if (!authStore.isUserAdmin) navigate(Paths.ROOT);
    }
  }, [authStore.userInfo]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        if (authStore.token) {
          const res = await getAllDepartments(authStore.token);
          res && setDepartments(res);
        }
      } catch (err) {
        alertStore.toggleAlert((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [authStore.isLoggedIn]);

  return (
    <div className={style.DepartmentPanel}>
      <h2 className={style.DepartmentPanel__title}>Работа с департаментами</h2>
      <FormDepartment />
      {isLoading ? (
        <Loading type={'spinningBubbles'} color={'#bdbdbd'} />
      ) : (
        <Table dataList={departmentList} type='department' />
      )}
    </div>
  );
};

export default observer(DepartmentPanel);
