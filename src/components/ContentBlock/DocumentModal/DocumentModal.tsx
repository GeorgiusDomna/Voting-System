import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Modal from 'react-modal';

import IdocumentData from '@/interfaces/IdocumentData';
import IdepartmentData from '@/interfaces/IdepartmentData';
import userInfo from '@/interfaces/userInfo';

import { getUserInfo } from '@/api/userService';
import { getDepartmentData } from '@/api/departmentService';
import { getDocumetData } from '@/api/docuService';

import alertStore from '@/stores/AlertStore';
import authStore from '@/stores/AuthStore';
import { Paths } from '@/enums/Paths';
import { dateFormater } from '@/utils/dateFormater';

import closeIcon from '@/assets/cancel.svg';
import defaultImg from '@/assets/testDocument.png';
import style from './documentModal.module.css';

if (process.env.NODE_ENV !== 'test') Modal.setAppElement('#root');

const DocumentModal: React.FC = () => {
  const [dataDoc, setDataDoc] = useState<IdocumentData | null>();
  const [dataUser, setDataUser] = useState<userInfo | null>();
  const [dataDepart, setDataDepart] = useState<IdepartmentData | null>();
  const navigate = useNavigate();
  const { id } = useParams();

  const closeModal = () => {
    navigate(Paths.ROOT);
    setDataDoc(null);
    setDataUser(null);
    setDataDepart(null);
    window.removeEventListener('keyup', closeModalEsc);
  };

  function closeModalEsc(event: KeyboardEvent) {
    event.key === 'Escape' && closeModal();
  }

  const handleImageError = () => {
    closeModal();
    alertStore.toggleAlert('Ошибка при загрузке изображения');
  };

  useEffect(() => {
    (async () => {
      if (id && authStore.token) {
        const resDoc = await getDocumetData(+id);
        if (resDoc) {
          setDataDoc(resDoc);
          const resUser = await getUserInfo(resDoc.creatorId);
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

  const docUrl: string = dataDoc?.files[0]
    ? `http://5.35.83.142:8082/api/doc/${dataDoc.id}/file/1/download`
    : defaultImg;

  return (
    <Modal isOpen={Boolean(id)} contentLabel='Модальное окно' className={style.modal}>
      <img src={closeIcon} className={style.modal__close} onClick={closeModal} />
      <div className={style.modal__document}>
        <img src={docUrl} onError={handleImageError} />
        <div className={style.documentInfo}>
          {dataDoc && (
            <>
              <h1 className={style.title}>Информация о документе:</h1>
              <div className={style.info}>
                <div className={style.info_item}>
                  Название: <i>{dataDoc.name}</i>
                </div>
                <div className={style.info_item}>
                  id: <i>{dataDoc.id}</i>
                </div>
                <div className={style.info_item}>
                  Создан: <i>{dateFormater(dataDoc.creationDate)}</i>
                </div>
                <div className={style.info_item}>
                  Обновлён: <i>{dateFormater(dataDoc.updateDate)}</i>
                </div>
              </div>
            </>
          )}
          {dataUser && (
            <>
              <h1 className={style.title}>Информация об авторе:</h1>
              <div className={style.info}>
                <div className={style.info_item}>
                  Имя: <i>{dataUser.lastName}</i> <i>{dataUser.firstName}</i>
                </div>
                <div className={style.info_item}>
                  Логин: <i>{dataUser.username}</i>
                </div>
                {dataDepart && (
                  <div className={style.info_item}>
                    Департамент: <i>{dataDepart?.name}</i>
                  </div>
                )}
                <div className={style.info_item}>
                  Email: <i>{dataUser.email}</i>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default DocumentModal;
