import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';
import { Localization } from '@/enums/Localization';

import Table from '@/components/Table/Table';
import Loading from '@/components/ContentBlock/Loading/Loading';
import DocumentModal from '@/components/ContentBlock/DocumentModal/DocumentModal';
import CreateDocumentModal from '@/components/ContentBlock/CreateDocumentModal/CreateDocumentModal';
import ModalConfirmAddApplication from '@/components/ContentBlock/CreateDocumentModal/ModalConfirmAddApplication/ModalConfirmAddApplication';
import CreateApplicationModal from '@/components/ContentBlock/CreateApplicationModal/CreateApplicationModal';

import documentStore from '@/stores/DocumentStore';

import style from './documentPanel.module.css';
import plusIcon from '@/assets/plus.png';

const DocumentPanel: React.FC = () => {
  const { loadData, documentPages, paginationInfo, currentPage, setCurrentPage, isLoading } =
    documentStore;
  const [isOpenModalCreateDocument, setIsOpenModalCreateDocument] = useState(false);
  const [isOpenModalConfirmAddApplication, setIsOpenModalConfirmAddApplication] = useState(false);
  const [isOpenModalCreateApplication, setIsOpenModalCreateApplication] = useState(false);
  const [idDoc, setIdDoc] = useState<number | null>(null);
  const { t } = useTranslation();

  const toggleModalCreateDocument = () => {
    setIsOpenModalCreateDocument(!isOpenModalCreateDocument);
  };

  const toggleModalConfirmAddApplication = (id: number | null = null) => {
    setIsOpenModalConfirmAddApplication(!isOpenModalConfirmAddApplication);
    setIdDoc(() => (id ? id : null));
  };

  const toggleModalCreateApplication = () => {
    setIsOpenModalCreateApplication(!isOpenModalCreateApplication);
  };

  useEffect(() => {
    loadData();
  }, [currentPage]);

  return (
    <div className={style.documentPanel}>
      <h2 className={style.dataList__title}>{t(Localization.Documents)}</h2>
      <div className={style.dataList__controls} onClick={toggleModalCreateDocument}>
        <img className={style.dataList__img} src={plusIcon} alt='+' />
        <button className={style.dataList__button}>
          {t(`${Localization.DocumentPanel}.AddDocument`)}
        </button>
      </div>
      {isLoading ? (
        <Loading type={'spinningBubbles'} color={'#bdbdbd'} />
      ) : (
        <>
          <Table
            dataList={documentPages}
            totalPages={paginationInfo.totalPages}
            сurrentPage={currentPage}
            setCurrentPage={setCurrentPage}
            type='document'
          />
          <DocumentModal toggle={toggleModalCreateApplication} setIdDoc={setIdDoc} />
          <CreateDocumentModal
            isOpen={isOpenModalCreateDocument}
            toggle={toggleModalCreateDocument}
            toggleConfirm={toggleModalConfirmAddApplication}
          />
          <ModalConfirmAddApplication
            isOpen={isOpenModalConfirmAddApplication}
            toggle={toggleModalConfirmAddApplication}
            toggleCreateApp={toggleModalCreateApplication}
            idDoc={idDoc}
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
