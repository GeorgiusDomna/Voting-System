import Modal from 'react-modal';
import alertStore from '@/stores/AlertStore';
import style from './documentModal.module.css';
import closeIcon from '@/assets/cancel.svg';

interface DocumentModalProps {
  data: string;
  isOpenModalWindow: boolean;
  toggleModalWindow: () => void;
  file: string;
}

if (process.env.NODE_ENV !== 'test') Modal.setAppElement('#root');

const DocumentModal: React.FC<DocumentModalProps> = ({
  data,
  isOpenModalWindow,
  toggleModalWindow,
  file,
}) => {
  const handleImageError = () => {
    toggleModalWindow();
    alertStore.toggleAlert('Ошибка при загрузке изображения');
  };
  return (
    <Modal isOpen={isOpenModalWindow} contentLabel='Модальное окно' className={style.modal}>
      <img src={closeIcon} className={style.modal__close} onClick={toggleModalWindow} />
      <div className={style.modal__document}>
        <img src={file} onError={handleImageError} />
        <div className={style.documentInfo}></div>
      </div>
      <p>{data}</p>
    </Modal>
  );
};

export default DocumentModal;
