import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
//import { useTranslation } from 'react-i18next';
//import { Localization } from '@/enums/Localization';
import { Paths } from '@/enums/Paths';

import Loading from '@/components/ContentBlock/Loading/Loading';
import Table from '@/components/Table/Table';
import DocumentModal from '@/components/ContentBlock/DocumentModal/DocumentModal';

import { getDepartmentData } from '@/api/departmentService';
import {
  getApplicationItemsByDepartment,
  getApplicationItemsByUser,
  getApplication,
} from '@/api/applicationService';
import { getDocumetData } from '@/api/docuService';
import { getUserMe } from '@/api/authService';

//import documentStore from '@/stores/DocumentStore';
import alertStore from '@/stores/AlertStore';
import authStore from '@/stores/AuthStore';

import IApplicationItem from '@/interfaces/IApplicationItem';
//import IApplication from '@/interfaces/IApplication';
import documentData from '@/interfaces/IdocumentData';

import style from './documentTake.module.css';

interface appItemInfo extends documentData {
  appId: number;
  appItemId: number;
}

const DocumentTake: React.FC = () => {
  const [appItemsList, setAppItemsList] = useState<appItemInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [department, setDepartment] = useState('');
  const fetch = useRef(false);
  const navigate = useNavigate();
  //const { t } = useTranslation();

  useEffect(() => {
    if (authStore.userInfo) {
      if (authStore.isUserAdmin) navigate(Paths.ROOT);
    }
  }, [authStore.userInfo]);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      if (authStore.token && authStore.userInfo) {
        if (fetch.current) return;
        fetch.current = true;

        const department = await getDepartmentData(
          authStore.userInfo.departmentId,
          authStore.token
        );
        department && setDepartment(department.name);
        //Получение имени департамента

        const appItems: IApplicationItem[] = await getApplicationItemsByDepartment(
          authStore.token,
          authStore.userInfo.departmentId
        );
        //Получение всех размещенных заявок на департаменте
        console.log(appItems, 'заявки на департаменте');

        const userAppItems: IApplicationItem[] = await getApplicationItemsByUser(
          authStore.token,
          authStore.userInfo.id
        );
        const userAppIds: number[] = userAppItems ? userAppItems.map((el) => el.id) : [];
        //Получение заявок закрепленных за текущим юзером
        console.log(userAppItems, 'заявки юзера');

        let appItemsTemp: {
          appId: number;
          appItemId: number;
        }[] = [];

        appItems &&
          (appItemsTemp = appItems
            .filter((el) => {
              if (!el.toUserId && !userAppIds.includes(el.applicationId)) return el.applicationId;
            })
            .map((el) => {
              return { appId: el.applicationId, appItemId: el.id };
            }));
        console.log(appItemsTemp, 'нужные');

        //Убираем ненужные заявки

        appItemsTemp.forEach((el) => {
          getApplication(authStore.token as string, el.appId).then((data) => {
            getDocumetData(authStore.token as string, data.documentId).then((doc) => {
              doc &&
                setAppItemsList((prev) => [
                  ...prev,
                  {
                    ...(doc as documentData),
                    appId: el.appId,
                    appItemId: el.appItemId,
                  },
                ]);
            });
          });
        });

        setIsLoading(false);
      }
    };
    try {
      fetchData();
    } catch (err) {
      alertStore.toggleAlert((err as Error).message);
    }
    return () => setAppItemsList([]);
  }, [authStore.isLoggedIn, authStore.userInfo]);

  return (
    <div className={style.documentTake}>
      <h1 className={style.documentTake__title}>Документы на рассмотрении</h1>
      {isLoading ? (
        <Loading type={'spinningBubbles'} color={'#bdbdbd'} />
      ) : (
        <>
          <h2 className={style.documentTake__subtitle}>{department}</h2>
          <Table dataList={appItemsList} type='document' />
          <DocumentModal />
        </>
      )}
    </div>
  );
};

export default observer(DocumentTake);
