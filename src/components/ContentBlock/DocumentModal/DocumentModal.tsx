import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Modal from 'react-modal';

import IdocumentData from '@/interfaces/IdocumentData';
import IdepartmentData from '@/interfaces/IDepartmentData';
import userInfo from '@/interfaces/userInfo';
import { Paths } from '@/enums/Paths';

import { getUserInfo } from '@/api/userService';
import { getDepartmentData } from '@/api/departmentService';
import { getDocumetData } from '@/api/docuService';
import { takeApplicationItem } from '@/api/applicationService';

import alertStore from '@/stores/AlertStore';
import authStore from '@/stores/AuthStore';
import { dateFormater } from '@/utils/dateFormater';

import closeIcon from '@/assets/cancel.svg';
import defaultImg from '@/assets/defaultImg.svg';
import style from './documentModal.module.css';

import { useTranslation } from 'react-i18next';
import { Localization } from '@/enums/Localization';
import plusIcon from '@/assets/plus.png';

if (process.env.NODE_ENV !== 'test') Modal.setAppElement('#root');

interface ModalProps {
  toggle?: () => void;
  setIdDoc?: (callback: () => number | null) => void;
}

const DocumentModal: React.FC<ModalProps> = ({ toggle = null, setIdDoc = null }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id, appId, appItemId } = useParams();
  const [dataDoc, setDataDoc] = useState<IdocumentData | null>();
  const [docUrl, setDocUrl] = useState<{ file: string; fileName?: string }[]>([
    { file: defaultImg },
  ]);
  const [currentImg, setCurrentImg] = useState(0);
  const [dataUser, setDataUser] = useState<userInfo | null>();
  const [dataDepart, setDataDepart] = useState<IdepartmentData | null>();
  const [prevLocation, setPrevLocation] = useState<null | string>(null);
  const dots: JSX.Element[] = [];
  const { t } = useTranslation();

  const closeModal = () => {
    prevLocation ? navigate(prevLocation, { state: { fetch: true } }) : navigate(Paths.ROOT);
    setDataDoc(null);
    setDocUrl([{ file: defaultImg }]);
    setDataUser(null);
    setDataDepart(null);
    setCurrentImg(0);
    window.removeEventListener('keyup', closeModalEsc);
  };

  function closeModalEsc(event: KeyboardEvent) {
    event.key === 'Escape' && closeModal();
  }

  const handleImageError = () => {
    closeModal();
    alertStore.toggleAlert(t(`${Localization.DocumentModal}.imageLoadError`));
  };

  const switchCurrentDoc = (action: boolean) => {
    action
      ? setCurrentImg(currentImg + 1 === docUrl.length ? 0 : currentImg + 1)
      : setCurrentImg(currentImg === 0 ? docUrl.length - 1 : currentImg - 1);
  };

  const takeApplication = () => {
    const take = async () => {
      try {
        if (appId && appItemId) {
          if (authStore.token) {
            const res = await takeApplicationItem(authStore.token, +appItemId, +appId);
            res && closeModal();
          }
        } else alertStore.toggleAlert(t(`${Localization.UserPanel}.errorAlert`));
      } catch (e) {
        alertStore.toggleAlert((e as Error).message);
      }
    };

    take();
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
  }, [location]);

  for (let i = 0; i < docUrl.length; i++) {
    dots.push(
      <span
        key={i}
        className={[style.dot, i == currentImg && style.active].join(' ')}
        onClick={() => setCurrentImg(i)}
      />
    );
  }

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
                <i>{docUrl[currentImg].fileName}</i>
              </div>
              <div className={style.fileControler}>
                <button onClick={() => switchCurrentDoc(false)}>&lt;</button>
                <button onClick={() => switchCurrentDoc(true)}>&gt;</button>
              </div>
            </div>
            <img src={docUrl[currentImg].file} onError={handleImageError} />
            <div className={style.dotContainer}>{dots}</div>
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
            {!appId && !appItemId && toggle && (
              <div className={style.dataList__controls} onClick={toggle}>
                <img className={style.dataList__img} src={plusIcon} alt='+' />
                <button className={style.dataList__button}>
                  {t(`${Localization.DocumentPanel}.AddApplication`)}
                </button>
              </div>
            )}
            {appId && appItemId && (
              <div className={style.vote}>
                <button className={style.vote__button} onClick={takeApplication}>
                  {'Голосовать'}
                </button>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default DocumentModal;
