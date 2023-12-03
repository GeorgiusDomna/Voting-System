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
import ModalConfirmAddApplication from '@/components/ContentBlock/CreateDocumentModal/ModalConfirmAddApplication/ModalConfirmAddApplication';
import CreateApplicationModal from '@/components/ContentBlock/CreateApplicationModal/CreateApplicationModal';

const DocumentPanel: React.FC = () => {
  const { documentList, setDocumentList } = documentStore;
  const [isOpenModalCreateDocument, setIsOpenModalCreateDocument] = useState(false);
  const [isOpenModalConfirmAddApplication, setIsOpenModalConfirmAddApplication] = useState(false);
  const [isOpenModalCreateApplication, setIsOpenModalCreateApplication] = useState(false);
  const [idDoc, setIdDoc] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const toggleModalCreateDocument = () => {
    setIsOpenModalCreateDocument(!isOpenModalCreateDocument);
  };

  const toggleModalConfirmAddApplication = () => {
    setIsOpenModalConfirmAddApplication(!isOpenModalConfirmAddApplication);
  };

  const toggleModalCreateApplication = () => {
    setIsOpenModalCreateApplication(!isOpenModalCreateApplication);
  };

  useEffect(() => {
    if (authStore.userInfo) {
      setIsAdmin(authStore.isUserAdmin);
    }
  }, [authStore.userInfo]);

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
      <div className={style.dataList__containerBtns}>
        <div className={style.dataList__controls} onClick={toggleModalCreateDocument}>
          <img className={style.dataList__img} src={plusIcon} alt='+' />
          <button className={style.dataList__button}>Добавить документ</button>
        </div>
        <div className={style.dataList__controls} onClick={toggleModalCreateApplication}>
          <img className={style.dataList__img} src={plusIcon} alt='+' />
          <button className={style.dataList__button}>Добавить голосование</button>
        </div>
      </div>
      {isLoading ? (
        <Loading type={'spinningBubbles'} color={'#bdbdbd'} />
      ) : (
        <>
          <Table dataList={documentList} type='document' />
          <DocumentModal />
          <CreateDocumentModal
            isOpen={isOpenModalCreateDocument}
            toggle={toggleModalCreateDocument}
            toggleConfirm={toggleModalConfirmAddApplication}
            setIdDoc={setIdDoc}
          />
          <ModalConfirmAddApplication
            isOpen={isOpenModalConfirmAddApplication}
            toggle={toggleModalConfirmAddApplication}
            toggleCreateApp={toggleModalCreateApplication}
          />
          <CreateApplicationModal
            isOpen={isOpenModalCreateApplication}
            toggle={toggleModalCreateApplication}
            idDoc={idDoc}
          />
        </>
      )}
    </div>
  );
};

export default observer(DocumentPanel);
