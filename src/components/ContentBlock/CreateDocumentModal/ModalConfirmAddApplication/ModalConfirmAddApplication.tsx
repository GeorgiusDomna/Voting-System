import Modal from 'react-modal';
import { observer } from 'mobx-react-lite';
import styles from '../createDocumentModal.module.css';
import stylesConfirm from './modalConfirmAddApplication.module.css';

interface ICreateDocumentModalProps {
  toggle: (id: null | number) => void;
  isOpen: boolean;
  toggleCreateApp: () => void;
  idDoc: null | number;
}

if (process.env.NODE_ENV !== 'test') Modal.setAppElement('#root');

const ModalConfirmAddApplication: React.FC<ICreateDocumentModalProps> = observer(
  ({ isOpen, toggle, toggleCreateApp, idDoc }) => {
    return (
      <Modal isOpen={isOpen} contentLabel='Модальное окно' className={styles.modal}>
        <button className={styles.modal__close} onClick={() => toggle(null)} />
        <p className={stylesConfirm.title}>Документ успешно создан!</p>
        <p className={stylesConfirm.subtitle}>Желаете создать голосование с этим документом?</p>
        <p>
          Если хотите продолжить позднее или прикрепить документ к другому голосованию нажмите
          &quot;Отмена&quot;.
        </p>
        <div className={stylesConfirm.containerButtons}>
          <button
            className={stylesConfirm.button}
            type='button'
            onClick={() => {
              toggle(idDoc);
              toggleCreateApp();
            }}
          >
            Да
          </button>
          <button className={stylesConfirm.button} type='button' onClick={() => toggle(null)}>
            Отмена
          </button>
        </div>
      </Modal>
    );
  }
);

export default ModalConfirmAddApplication;
