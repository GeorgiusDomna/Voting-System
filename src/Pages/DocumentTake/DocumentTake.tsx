import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { Localization } from '@/enums/Localization';
import { Paths } from '@/enums/Paths';

import Loading from '@/components/ContentBlock/Loading/Loading';
import Table from '@/components/Table/Table';

import { getDepartmentData } from '@/api/departmentService';

import documentStore from '@/stores/DocumentStore';
import alertStore from '@/stores/AlertStore';
import authStore from '@/stores/AuthStore';

import style from './documentTake.module.css';

const DocumentTake: React.FC = () => {
  const { documentList, setDocumentList } = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [department, setDepartment] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    if (authStore.userInfo) {
      if (!authStore.isUserAdmin) navigate(Paths.ROOT);
    }
  }, [authStore.userInfo]);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      if (authStore.token && authStore.userInfo) {
        let res = await getDepartmentData(authStore.userInfo.departmentId, authStore.token);
        res && setDepartment(res.name);

        res = await getNotTakenApplication(authStore.token);
        res && setDocumentList(res);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [authStore.isLoggedIn]);

  return (
    <div className={style.documentTake}>
      <h1 className={style.documentTake__title}>Документы на рассмотрении</h1>
      <h2 className={style.documentTake__subtitle}>{department}</h2>
    </div>
  );
};

export default DocumentTake;
