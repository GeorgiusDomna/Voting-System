import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import Loading from '@/components/ContentBlock/Loading/Loading';

import { getAllDocuments } from '@/api/documentService';
import documentStore from '@/stores/DocumentStore';
import authStore from '@/stores/AuthStore';

import style from './documentPanel.module.css';
import Table from '@/components/Table/Table';

const DocumentPanel: React.FC = () => {
  const { documentList, setDocumentList } = documentStore;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      if (authStore.isLoggedIn) {
        const res = await getAllDocuments();
        res && setDocumentList(res);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [authStore.isLoggedIn]);

  return (
    <div className={style.documentPanel}>
      <h2 className={style.dataList__title}>Документы</h2>
      {isLoading ? (
        <Loading type={'spinningBubbles'} color={'#bdbdbd'} />
      ) : (
        <Table dataList={documentList} type='document' />
      )}
    </div>
  );
};

export default observer(DocumentPanel);
