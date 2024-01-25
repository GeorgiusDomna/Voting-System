import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { Localization } from '@/enums/Localization';
import { Paths } from '@/enums/Paths';

import FormDepartment from '@/components/ContentBlock/FormDepartment/FormDepartment';
import Loading from '@/components/ContentBlock/Loading/Loading';
import Table from '@/components/Table/Table';

import departmentsStore from '@/stores/DepartmentStore';
import authStore from '@/stores/AuthStore';

import style from './departmentPanel.module.css';

const DepartmentPanel: React.FC = () => {
  const { loadData, departamentPages, paginationInfo, currentPage, setCurrentPage, isLoading } =
    departmentsStore;
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (authStore.userInfo) {
      if (!authStore.isUserAdmin) navigate(Paths.ROOT);
    }
  }, [authStore.userInfo]);

  useEffect(() => {
    loadData();
  }, [currentPage]);

  return (
    <div className={style.DepartmentPanel}>
      <h2 className={style.DepartmentPanel__title}>{t(`${Localization.DepartmentPanel}.title`)}</h2>
      <FormDepartment />
      {isLoading ? (
        <Loading type={'spinningBubbles'} color={'#bdbdbd'} />
      ) : (
        <Table
          dataList={departamentPages}
          totalPages={paginationInfo.totalPages}
          сurrentPage={currentPage}
          setCurrentPage={setCurrentPage}
          type='department'
        />
      )}
    </div>
  );
};

export default observer(DepartmentPanel);
