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
import docuImg from '@/assets/testDocument.png';
import style from './documentModal.module.css';

interface DocumentModalProps {
  isOpenModalWindow: boolean;
  toggleModalWindow: () => void;
}
if (process.env.NODE_ENV !== 'test') Modal.setAppElement('#root');

const DocumentModal: React.FC<DocumentModalProps> = ({ isOpenModalWindow, toggleModalWindow }) => {
  const [dataUser, setDataUser] = useState<userInfo>();
  const [dataDepartament, setDataDepartament] = useState<IdepartmentData>();
  const [dataDocument, setDataDocument] = useState<IdocumentData>();
  const navigate = useNavigate();
  const { id } = useParams();

  const closeModal = () => {
    toggleModalWindow();
    navigate(Paths.ROOT);
  };

  const closeModalEsc = (event: KeyboardEvent) => event.key === 'Escape' && closeModal();

  const handleImageError = () => {
    closeModal();
    alertStore.toggleAlert('Ошибка при загрузке изображения');
  };

  useEffect(() => {
    (async () => {
      if (id && authStore.token) {
        const resDoc = await getDocumetData(+id);
        if (resDoc) {
          setDataDocument(resDoc);
          toggleModalWindow();
          const resUser = await getUserInfo(resDoc.creatorId);
          if (resUser) {
            setDataUser(resUser);
            const resDepart = await getDepartmentData(resUser.departmentId, authStore.token);
            resDepart && setDataDepartament(resDepart);
          }
        }
      }
    })();
    window.addEventListener('keyup', closeModalEsc);
  }, [id]);

  return (
    <Modal isOpen={isOpenModalWindow} contentLabel='Модальное окно' className={style.modal}>
      <img src={closeIcon} className={style.modal__close} onClick={closeModal} />
      <div className={style.modal__document}>
        <img
          src={dataDocument?.files[0] ? dataDocument?.files[0].name : docuImg}
          onError={handleImageError}
        />
        <div className={style.documentInfo}>
          {dataDocument && (
            <>
              <h1 className={style.title}>Информация о документе:</h1>
              <div className={style.info}>
                <div className={style.info_item}>
                  Название: <i>{dataDocument.name}</i>
                </div>
                <div className={style.info_item}>
                  id: <i>{dataDocument.id}</i>
                </div>
                <div className={style.info_item}>
                  Создан: <i>{dateFormater(dataDocument.creationDate)}</i>
                </div>
                <div className={style.info_item}>
                  Обновлён: <i>{dateFormater(dataDocument.updateDate)}</i>
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
                {dataDepartament && (
                  <div className={style.info_item}>
                    Департамент: <i>{dataDepartament?.name}</i>
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
