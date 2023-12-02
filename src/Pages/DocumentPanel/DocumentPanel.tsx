import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import Table from '@/components/Table/Table';
import Loading from '@/components/ContentBlock/Loading/Loading';
import DocumentModal from '@/components/ContentBlock/DocumentModal/DocumentModal';

import { getAllDocuments } from '@/api/docuService';
import { getUserMe } from '@/api/authService';
import documentStore from '@/stores/DocumentStore';
import authStore from '@/stores/AuthStore';
import alertStore from '@/stores/AlertStore';

import { useTranslation } from 'react-i18next';
import { Localization } from '@/enums/Localization';

import style from './documentPanel.module.css';

const DocumentPanel: React.FC = () => {
  const { documentList, setDocumentList } = documentStore;
  const [isOpenModalWindow, setIsOpenModalWindow] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const { t } = useTranslation();
  const toggleModalWindow = () => {
    setIsOpenModalWindow(!isOpenModalWindow);
  };

  useEffect(() => {
    if (authStore.token) {
      getUserMe(authStore.token)
        .then((res) => {
          authStore.setUserInfo(res);
          setIsAdmin(authStore.isUserAdmin);
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
      if (authStore.token) {
        const res = await getAllDocuments(authStore.token);
        res && setDocumentList(res);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [authStore.isLoggedIn]);

  return (
    <div className={style.documentPanel}>
      <h2 className={style.dataList__title}>{t(Localization.Documents)}</h2>
      {isLoading ? (
        <Loading type={'spinningBubbles'} color={'#bdbdbd'} />
      ) : (
        <>
          <Table dataList={documentList} type='document' />
          <DocumentModal
            isOpenModalWindow={isOpenModalWindow}
            toggleModalWindow={toggleModalWindow}
          />
        </>
      )}
    </div>
  );
};

export default observer(DocumentPanel);
