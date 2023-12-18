import { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Modal from 'react-modal';

import IdocumentData from '@/interfaces/IdocumentData';
import IdepartmentData from '@/interfaces/IdepartmentData';
import userInfo from '@/interfaces/userInfo';
import { Paths } from '@/enums/Paths';

import { getUserInfo } from '@/api/userService';
import { getDepartmentData } from '@/api/departmentService';
import { getDocumetData } from '@/api/docuService';

import alertStore from '@/stores/AlertStore';
import authStore from '@/stores/AuthStore';
import { dateFormater } from '@/utils/dateFormater';

import closeIcon from '@/assets/cancel.svg';
import defaultImg from '@/assets/defaultImg.svg';
import style from './documentModal.module.css';

import { useTranslation } from 'react-i18next';
import { Localization } from '@/enums/Localization';

if (process.env.NODE_ENV !== 'test') Modal.setAppElement('#root');

const DocumentModal: React.FC = () => {
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
    prevLocation ? navigate(prevLocation) : navigate(Paths.ROOT);
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

  const takeApplication = () => {};

  useEffect(() => {
    if (!id) setPrevLocation(location.pathname);
    (async () => {
      if (id && authStore.token) {
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
  }, [id]);

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
              <h1 className={style.title}> {t(`${Localization.DocumentModal}.authorInfoTitle`)}</h1>
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
        </div>
        {appId && appItemId && <button onClick={takeApplication}>{'Голосовать'}</button>}
      </div>
    </Modal>
  );
};

export default DocumentModal;
