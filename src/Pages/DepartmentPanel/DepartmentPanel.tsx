import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { Localization } from '@/enums/Localization';
import { Paths } from '@/enums/Paths';

import FormDepartment from '@/components/ContentBlock/FormDepartment/FormDepartment';
import Loading from '@/components/ContentBlock/Loading/Loading';
import Table from '@/components/Table/Table';

import { getDepartmentsByPage } from '@/api/departmentService';
import departmentsStore from '@/stores/DepartmentStore';
import alertStore from '@/stores/AlertStore';
import authStore from '@/stores/AuthStore';

import style from './departmentPanel.module.css';

const DepartmentPanel: React.FC = () => {
  const {
    departamentPages,
    setDepartmentPage,
    setPaginationInfo,
    paginationInfo,
    currentPage,
    setCurrentPage,
  } = departmentsStore;
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (authStore.userInfo) {
      if (!authStore.isUserAdmin) navigate(Paths.ROOT);
    }
  }, [authStore.userInfo]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        if (authStore.token && !departamentPages[currentPage]) {
          const res = await getDepartmentsByPage(currentPage, paginationInfo.size);
          if (res) {
            const { content, ...paginationInfo } = res;
            setDepartmentPage(content);
            setPaginationInfo(paginationInfo);
          }
        }
      } catch (err) {
        alertStore.toggleAlert((err as Error).message);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [currentPage]);

  return (
    <div className={style.DepartmentPanel}>
      <h2 className={style.DepartmentPanel__title}>{t(`${Localization.DepartmentPanel}.title`)}</h2>
      <FormDepartment />
      {isLoading ? (
        <Loading type={'spinningBubbles'} color={'#bdbdbd'} />
      ) : (
        <Table
          totalPages={paginationInfo.totalPages}
          сurrentPage={currentPage}
          setCurrentPage={setCurrentPage}
          dataList={departamentPages}
          type='department'
        />
      )}
    </div>
  );
};

export default observer(DepartmentPanel);
