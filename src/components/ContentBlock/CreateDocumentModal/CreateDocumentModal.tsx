import Modal from 'react-modal';
import { observer } from 'mobx-react-lite';
import * as Yup from 'yup';
import { Form, Formik, FormikHelpers } from 'formik';
import InputText from '@/components/Auth/Inputs/InputText';
import styles from './createDocumentModal.module.css';
import { Dispatch, SetStateAction, useState } from 'react';
import InputUpload from '@/components/ContentBlock/CreateDocumentModal/InputUpload/InputUpload';
import authStore from '@/stores/AuthStore';
import { createDoc, createFile } from '@/api/docuService';
import alertStore from '@/stores/AlertStore';

interface ICreateDocumentModalProps {
  toggle: () => void;
  isOpen: boolean;
  toggleConfirm: () => void;
  setIdDoc: Dispatch<SetStateAction<number | null>>;
}

interface values {
  docname: string;
  file: string;
}

interface valuesImages {
  image: string;
  text: string;
  id: number;
}

interface valuesFiles {
  file: File;
  id: number;
}

if (process.env.NODE_ENV !== 'test') Modal.setAppElement('#root');

const CreateDocumentModal: React.FC<ICreateDocumentModalProps> = observer(
  ({ isOpen, toggle, toggleConfirm, setIdDoc }) => {
    const [images, setImages] = useState<valuesImages[]>([]);
    const [files, setFiles] = useState<valuesFiles[]>([]);
    const [count, setCount] = useState<number>(0);

    const CreateDocumentSchema = Yup.object().shape({
      docname: Yup.string().min(2, 'Минимум 2 символа').required('Поле обязательно для заполнения'),
      file: Yup.string().required('Загрузите файлы'),
    });

    function handleSubmit(values: values, { resetForm }: FormikHelpers<values>) {
      if (authStore.token) {
        createDoc(authStore.token, values.docname)
          .then((res) => {
            Promise.all(
              files.map((item) => {
                if (authStore.token) {
                  return createFile(authStore.token, res.id, item.file);
                }
                return;
              })
            )
              .then(() => {
                resetForm();
                toggle();
                toggleConfirm();
                setIdDoc(() => res.id);
                setImages([]);
                setFiles([]);
              })
              .catch((error) => alertStore.toggleAlert(error));
          })
          .catch((error) => alertStore.toggleAlert(error));
      }
    }

    function deleteImage(id: number) {
      setImages(images.filter((item) => item.id !== id));
      setFiles(files.filter((item) => item.id !== id));
    }

    return (
      <Modal isOpen={isOpen} contentLabel='Модальное окно' className={styles.modal}>
        <button className={styles.modal__close} onClick={toggle} />
        <Formik
          initialValues={{
            docname: '',
            file: '',
          }}
          validateOnMount
          validateOnChange
          validationSchema={CreateDocumentSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, values, isValid, errors, submitCount }) => (
            <Form className={styles.form} name='createDoc'>
              <InputText
                type='text'
                name='docname'
                placeholder='Название документа'
                value={values.docname}
                error={errors.docname}
                handleChange={handleChange}
                submitCount={submitCount}
              />
              <ul
                className={[
                  styles.listImage,
                  `${images.length > 6 && styles.listImage_scroll}`,
                ].join(' ')}
              >
                {images.length > 0 &&
                  images.map((item) => (
                    <li key={item.id} className={styles.itemImage}>
                      <button
                        type='button'
                        className={styles.deleteImage}
                        onClick={() => deleteImage(item.id)}
                      />
                      <img className={styles.preview} src={item.image} alt={item.text} />
                      <p className={styles.previewText} title={item.text}>
                        {item.text}
                      </p>
                    </li>
                  ))}
              </ul>
              <InputUpload
                name='file'
                placeholder='Название документа'
                value={values.file}
                error={errors.file}
                handleChange={handleChange}
                submitCount={submitCount}
                images={images}
                setImages={setImages}
                filesImages={files}
                setFiles={setFiles}
                count={count}
                setCount={setCount}
              />
              <button
                type='submit'
                className={styles.button}
                disabled={submitCount >= 1 && !isValid}
              >
                Добавить документ
              </button>
            </Form>
          )}
        </Formik>
      </Modal>
    );
  }
);

export default CreateDocumentModal;
