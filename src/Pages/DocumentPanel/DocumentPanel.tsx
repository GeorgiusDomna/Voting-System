import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import Table from '@/components/Table/Table';
import Loading from '@/components/ContentBlock/Loading/Loading';
import DocumentModal from '@/components/ContentBlock/DocumentModal/DocumentModal';
import CreateDocumentModal from '@/components/ContentBlock/CreateDocumentModal/CreateDocumentModal';
import { getAllDocuments } from '@/api/docuService';
import documentStore from '@/stores/DocumentStore';
import authStore from '@/stores/AuthStore';
import style from './documentPanel.module.css';
import plusIcon from '@/assets/plus.png';

const DocumentPanel: React.FC = () => {
  const { documentList, setDocumentList } = documentStore;
  const [isOpenModalWindow, setIsOpenModalWindow] = useState(false);
  const [isOpenModalCreateDocument, setIsOpenModalCreateDocument] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const toggleModalWindow = () => {
    setIsOpenModalWindow(!isOpenModalWindow);
  };

  const toggleModalCreateDocument = () => {
    setIsOpenModalCreateDocument(!isOpenModalCreateDocument);
  };

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
      <h2 className={style.dataList__title}>Документы</h2>
      <div className={style.dataList__controls} onClick={toggleModalCreateDocument}>
        <img className={style.dataList__img} src={plusIcon} alt='+' />
        <button className={style.dataList__button}>Добавить документ</button>
      </div>
      {isLoading ? (
        <Loading type={'spinningBubbles'} color={'#bdbdbd'} />
      ) : (
        <>
          <Table dataList={documentList} type='document' />
          <DocumentModal
            isOpenModalWindow={isOpenModalWindow}
            toggleModalWindow={toggleModalWindow}
          />
          <CreateDocumentModal
            isOpen={isOpenModalCreateDocument}
            toggle={toggleModalCreateDocument}
          />
        </>
      )}
    </div>
  );
};

export default observer(DocumentPanel);
