import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Document, Page } from 'react-pdf';
import { pdfjs } from 'react-pdf';
import { useTranslation } from 'react-i18next';
import { Localization } from '@/enums/Localization';
import { Paths } from '@/enums/Paths';
import Modal from 'react-modal';

import VotingController from './VotingController/VotingController';

import IdocumentData from '@/interfaces/IdocumentData';
import { IDepartmentData } from '@/interfaces/IdepartmentData';
import userInfo from '@/interfaces/userInfo';

import { getUserInfo } from '@/api/userService';
import { getDepartmentData } from '@/api/departmentService';
import { getDocumetData } from '@/api/docuService';

import alertStore from '@/stores/AlertStore';
import authStore from '@/stores/AuthStore';
import { dateFormater } from '@/utils/dateFormater';

import style from './documentModal.module.css';
import 'react-pdf/dist/Page/TextLayer.css';
import 'react-pdf/dist/Page/AnnotationLayer.css';

import closeIcon from '@/assets/cancel.svg';
import defaultImg from '@/assets/defaultImg.svg';

if (process.env.NODE_ENV !== 'test') Modal.setAppElement('#root');

interface ModalProps {
  toggle?: () => void;
  setIdDoc?: (callback: () => number | null) => void;
}

const DocumentModal: React.FC<ModalProps> = ({ toggle = null, setIdDoc = null }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, appId, appItemId } = useParams();
  const [numPages, setNumPages] = useState<number>();
  const [currentView, setCurrentView] = useState(0);
  const [dataDoc, setDataDoc] = useState<IdocumentData | null>();
  const [isModeImg, setIsModeImg] = useState<boolean>(true);
  const [docUrl, setDocUrl] = useState<{ file: string; fileName?: string }[]>([
    { file: defaultImg },
  ]);
  const [dataUser, setDataUser] = useState<userInfo | null>();
  const [dataDepart, setDataDepart] = useState<IDepartmentData | null>();
  const [prevLocation, setPrevLocation] = useState<null | string>(null);
  const dots: JSX.Element[] = [];
  const { t } = useTranslation();

  const closeModal = () => {
    prevLocation ? navigate(prevLocation, { state: { fetch: true } }) : navigate(Paths.ROOT);
    setDataDoc(null);
    setDocUrl([{ file: defaultImg }]);
    setDataUser(null);
    setDataDepart(null);
    setCurrentView(0);
    setIsModeImg(true);
  };

  function closeModalEsc(event: KeyboardEvent) {
    event.key === 'Escape' && closeModal();
  }

  const handleImageError = () => {
    closeModal();
    alertStore.toggleAlert(t(`${Localization.DocumentModal}.imageLoadError`));
  };

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const switchCurrentDoc = (action: boolean) => {
    if (!isModeImg) {
      const pages: number = numPages ? (numPages as number) : docUrl.length;
      action
        ? setCurrentView(currentView + 1 > pages ? 1 : currentView + 1)
        : setCurrentView(currentView === 1 ? pages : currentView - 1);
    } else {
      action
        ? setCurrentView(currentView + 1 === docUrl.length ? 0 : currentView + 1)
        : setCurrentView(currentView === 0 ? docUrl.length - 1 : currentView - 1);
    }
  };

  useEffect(() => {
    if (appId) setPrevLocation(Paths.DOCUMENTS_TAKE);
    (async () => {
      if (id && authStore.token) {
        setIdDoc && setIdDoc(() => Number(id));
        const resDoc = await getDocumetData(authStore.token, +id);
        if (resDoc) {
          setDataDoc(resDoc);
          if (resDoc.files[0]) {
            resDoc.files[0].name.toLowerCase().endsWith('.pdf') &&
              (setIsModeImg(false), setCurrentView(currentView + 1));
            setDocUrl(
              resDoc.files.map((file) => {
                return {
                  file: `http://5.35.83.142:8082/api/doc/${resDoc.id}/file/${file.id}/download`,
                  fileName: file.name,
                };
              })
            );
          }
          const resUser = await getUserInfo(resDoc.creatorId, authStore.token);
          if (resUser) {
            setDataUser(resUser);
            if (resUser.departmentId) {
              const resDepart = await getDepartmentData(resUser.departmentId, authStore.token);
              resDepart && setDataDepart(resDepart);
            }
          }
        }
      }
    })();
    window.addEventListener('keyup', closeModalEsc);
    return () => window.removeEventListener('keyup', closeModalEsc);
  }, [location]);

  if (docUrl.length !== 1) {
    for (let i = 0; i < docUrl.length; i++) {
      dots.push(
        <span
          key={i}
          className={[style.dot, i == currentView && style.active].join(' ')}
          onClick={() => setCurrentView(i)}
        />
      );
    }
  }

  pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

  return (
    <>
      <Modal
        isOpen={Boolean(id)}
        contentLabel={t(`${Localization.DocumentModal}.ModalWindow`)}
        className={style.modal}
      >
        <img src={closeIcon} className={style.modal__close} onClick={closeModal} />
        <div className={style.modal__document}>
          <div className={style.imageContainer}>
            <div className={style.document_header}>
              <div className={style.fileName}>
                <i>{docUrl.length > 1 ? docUrl[currentView].fileName : docUrl[0].fileName}</i>
              </div>
              <div className={style.fileControler}>
                <button onClick={() => switchCurrentDoc(false)}>&lt;</button>
                <button onClick={() => switchCurrentDoc(true)}>&gt;</button>
              </div>
            </div>
            {!isModeImg ? (
              <>
                <Document file={docUrl[0].file} onLoadSuccess={onDocumentLoadSuccess}>
                  <Page pageNumber={currentView} />
                </Document>
                <p>
                  Page {currentView} of {numPages}
                </p>
              </>
            ) : (
              <>
                <img src={docUrl[currentView].file} onError={handleImageError} alt='Image' />
                <div className={style.dotContainer}>{dots}</div>
              </>
            )}
          </div>

          <div className={style.documentInfo}>
            {dataDoc && (
              <>
                <h1 className={style.title}>
                  {t(`${Localization.DocumentModal}.documentInfoTitle`)}
                </h1>
                <div className={style.info}>
                  <div className={style.info_item}>
                    {t(`${Localization.DocumentModal}.fileName`)}
                    <i>{dataDoc.name}</i>
                  </div>
                  <div className={style.info_item}>
                    id: <i>{dataDoc.id}</i>
                  </div>
                  <div className={style.info_item}>
                    {t(`${Localization.DocumentModal}.created`)}
                    <i>{dateFormater(dataDoc.creationDate)}</i>
                  </div>
                  <div className={style.info_item}>
                    {t(`${Localization.DocumentModal}.updated`)}
                    <i>{dateFormater(dataDoc.updateDate)}</i>
                  </div>
                </div>
              </>
            )}
            {dataUser && (
              <>
                <h1 className={style.title}>
                  {' '}
                  {t(`${Localization.DocumentModal}.authorInfoTitle`)}
                </h1>
                <div className={style.info}>
                  <div className={style.info_item}>
                    {t(`${Localization.DocumentModal}.name`)}
                    <i>{dataUser.lastName}</i> <i>{dataUser.firstName}</i>
                  </div>
                  <div className={style.info_item}>
                    {t(`${Localization.DocumentModal}.login`)}
                    <i>{dataUser.username}</i>
                  </div>
                  {dataDepart && (
                    <div className={style.info_item}>
                      {t(`${Localization.DocumentModal}.department`)}
                      <i>{dataDepart?.name}</i>
                    </div>
                  )}
                  <div className={style.info_item}>
                    {t(`${Localization.DocumentModal}.email`)}
                    <i>{dataUser.email}</i>
                  </div>
                </div>
              </>
            )}
            <VotingController
              appId={appId}
              appItemId={appItemId}
              toggle={toggle}
              closeModal={closeModal}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DocumentModal;
