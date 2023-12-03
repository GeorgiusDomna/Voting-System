import Modal from 'react-modal';
import { observer } from 'mobx-react-lite';
import * as Yup from 'yup';
import { Form, Formik, FormikHelpers } from 'formik';
import InputText from '@/components/Auth/Inputs/InputText';
import styles from '@/components/ContentBlock/CreateDocumentModal/createDocumentModal.module.css';
import stylesApp from './createApplicationModal.module.css';
import { useEffect, useState } from 'react';
import { downloadFile, getDocumetData } from '@/api/docuService';
import alertStore from '@/stores/AlertStore';
import documentData from '@/interfaces/IdocumentData';
import authStore from '@/stores/AuthStore';
import { connectDocToApplication, createApplication } from '@/api/applicationService';

interface ICreateApplicationModalProps {
  toggle: () => void;
  isOpen: boolean;
  idDoc: number | null;
}

interface values {
  docapp: string;
  deadline: string;
}

if (process.env.NODE_ENV !== 'test') Modal.setAppElement('#root');

const CreateApplicationModal: React.FC<ICreateApplicationModalProps> = observer(
  ({ isOpen, toggle, idDoc }) => {
    const [docInfo, setDocInfo] = useState<documentData>({
      creationDate: '',
      creatorId: 0,
      documentConstructorTypeId: 0,
      fieldsValues: {},
      files: [{ id: 0, name: '' }],
      id: 0,
      name: '',
      updateDate: '',
    });

    const CreateApplicationSchema = Yup.object().shape({
      docapp: Yup.string().min(2, 'Минимум 2 символа').required('Поле обязательно для заполнения'),
      deadline: Yup.date()
        .min(new Date(), 'Выберите дату, не ранее сегодняшней')
        .required('Выберите дату окончания голосования'),
    });

    useEffect(() => {
      if (idDoc) {
        getDocumetData(idDoc)
          .then((res) => {
            if (res) {
              setDocInfo(res);
            }
          })
          .catch((error) => alertStore.toggleAlert(error));
      }
    }, [idDoc]);

    function handleSubmit(values: values, { resetForm }: FormikHelpers<values>) {
      const obj = {
        name: values.docapp,
        deadlineDate: new Date(values.deadline).toISOString(),
      };
      if (authStore.token) {
        createApplication(authStore.token, obj)
          .then((res) => {
            if (authStore.token && idDoc) {
              connectDocToApplication(authStore.token, res.id, idDoc)
                .then(() => {
                  resetForm();
                  toggle();
                })
                .catch((error) => alertStore.toggleAlert(error));
            }
          })
          .catch((error) => alertStore.toggleAlert(error));
      }
    }

    function handleDownloadDocument(fileId: number, filename: string) {
      if (authStore.token && idDoc) {
        downloadFile(authStore.token, idDoc, fileId)
          .then((blob) => {
            const url = window.URL.createObjectURL(new Blob([blob]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            if (link.parentNode) {
              link.parentNode.removeChild(link);
            }
          })
          .catch((error) => alertStore.toggleAlert(error));
      }
    }

    return (
      <Modal isOpen={isOpen} contentLabel='Модальное окно' className={styles.modal}>
        <button className={styles.modal__close} onClick={toggle} />
        <Formik
          initialValues={{
            docapp: '',
            deadline: '',
          }}
          validateOnMount
          validateOnChange
          validationSchema={CreateApplicationSchema}
          onSubmit={handleSubmit}
        >
          {({ handleChange, values, isValid, errors, submitCount }) => (
            <Form className={styles.form} name='createApp'>
              <InputText
                type='text'
                name='docapp'
                placeholder='Название голосования'
                value={values.docapp}
                error={errors.docapp}
                handleChange={handleChange}
                submitCount={submitCount}
              />
              <InputText
                type='datetime-local'
                name='deadline'
                placeholder='Дата окончания'
                value={values.deadline}
                error={errors.deadline}
                handleChange={handleChange}
                submitCount={submitCount}
              />
              <ul className={stylesApp.listDocs}>
                Прикрепленные документы:
                <li>
                  <ul className={stylesApp.listFiles}>
                    <p className={stylesApp.docName} title={docInfo.name}>
                      {docInfo.name}
                    </p>
                    {docInfo.files.map((item) => (
                      <li className={stylesApp.file} key={item.id}>
                        <p className={stylesApp.fileName} title={item.name}>
                          {item.name}
                        </p>
                        <button
                          className={stylesApp.button}
                          type='button'
                          onClick={() => handleDownloadDocument(item.id, item.name)}
                        >
                          Скачать
                        </button>
                      </li>
                    ))}
                  </ul>
                </li>
              </ul>
              <button
                type='submit'
                className={styles.button}
                disabled={submitCount >= 1 && !isValid}
              >
                Создать голосование
              </button>
            </Form>
          )}
        </Formik>
      </Modal>
    );
  }
);

export default CreateApplicationModal;
