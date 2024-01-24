import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
//import { useTranslation } from 'react-i18next';
//import { Localization } from '@/enums/Localization';
import { Paths } from '@/enums/Paths';

import Loading from '@/components/ContentBlock/Loading/Loading';
import Table from '@/components/Table/Table';
import DocumentModal from '@/components/ContentBlock/DocumentModal/DocumentModal';

import authStore from '@/stores/AuthStore';
import voitingStore from '@/stores/VotingStore';

import style from './documentTake.module.css';

const DocumentTake: React.FC = () => {
  const { loadData, departamentInfo, appItemsList, isLoading } = voitingStore;
  const navigate = useNavigate();
  //const { t } = useTranslation();

  useEffect(() => {
    if (authStore.userInfo) {
      if (authStore.isUserAdmin) navigate(Paths.ROOT);
    }
  }, [authStore.userInfo]);

  useEffect(() => {
    loadData();
  }, [authStore.userInfo]);

  return (
    <div className={style.documentTake}>
      <h1 className={style.documentTake__title}>Документы на рассмотрении</h1>
      {isLoading ? (
        <Loading type={'spinningBubbles'} color={'#bdbdbd'} />
      ) : (
        <>
          <h2 className={style.documentTake__subtitle}>{departamentInfo?.name}</h2>
          <Table dataList={[appItemsList]} type='document' />
          <DocumentModal />
        </>
      )}
    </div>
  );
};

export default observer(DocumentTake);
