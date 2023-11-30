import { useEffect, useState } from 'react';
import Modal from 'react-modal';

import IdocumentData from '@/interfaces/IdocumentData';
import IdepartmentData from '@/interfaces/IdepartmentData';
import userInfo from '@/interfaces/userInfo';

import { getUserInfo } from '@/api/userService';
import { getDepartmentInfo } from '@/api/departmentService';

import alertStore from '@/stores/AlertStore';
import { dateFormater } from '@/utils/dateFormater';

import closeIcon from '@/assets/cancel.svg';
import style from './documentModal.module.css';
import docuImg from '@/assets/testDocument.jpg';

interface DocumentModalProps {
  data: IdocumentData;
  isOpenModalWindow: boolean;
  toggleModalWindow: () => void;
}
if (process.env.NODE_ENV !== 'test') Modal.setAppElement('#root');

const DocumentModal: React.FC<DocumentModalProps> = ({
  data,
  isOpenModalWindow,
  toggleModalWindow,
}) => {
  const [dataUser, setDataUser] = useState<userInfo>();
  const [dataDepartament, setDataDepartament] = useState<IdepartmentData>();

  const closeModalEsc = (event: KeyboardEvent) => {
    event.key === 'Escape' && toggleModalWindow();
    window.removeEventListener('keyup', closeModalEsc);
  };

  useEffect(() => {
    (async () => {
      const resUser = await getUserInfo(data.creatorId);
      if (resUser) {
        setDataUser(resUser);
        const resDepartament = await getDepartmentInfo(resUser.departmentId);
        resDepartament && setDataDepartament(resDepartament);
      }
    })();
    window.addEventListener('keyup', closeModalEsc);
  }, [data.creatorId]);

  const handleImageError = () => {
    toggleModalWindow();
    alertStore.toggleAlert('Ошибка при загрузке изображения');
  };

  return (
    <Modal isOpen={isOpenModalWindow} contentLabel='Модальное окно' className={style.modal}>
      <img src={closeIcon} className={style.modal__close} onClick={toggleModalWindow} />
      <div className={style.modal__document}>
        <img src={docuImg} onError={handleImageError} />
        <div className={style.documentInfo}>
          <h1 className={style.title}>Информация о документе:</h1>
          <div className={style.info}>
            <div className={style.info_item}>
              Название: <i>{data.name}</i>
            </div>
            <div className={style.info_item}>
              id: <i>{data.id}</i>
            </div>
            <div className={style.info_item}>
              Создан: <i>{dateFormater(data.creationDate)}</i>
            </div>
            <div className={style.info_item}>
              Обновлён: <i>{dateFormater(data.updateDate)}</i>
            </div>
          </div>
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
                <div className={style.info_item}>
                  Департамент: <i>{dataDepartament?.name}</i>
                </div>
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
