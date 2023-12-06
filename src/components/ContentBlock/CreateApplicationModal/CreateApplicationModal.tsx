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
import JSZip from 'jszip';
import { useTranslation } from 'react-i18next';
import { Localization } from '@/enums/Localization';

interface ICreateApplicationModalProps {
  toggle: () => void;
  isOpen: boolean;
  idDoc: number | null;
}

interface values {
  docapp: string;
  deadline: string;
}

interface fileData {
  name: string;
  id: number;
  url: string;
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

    const [filesInfo, setFilesInfo] = useState<fileData[]>([
      {
        name: '',
        id: 0,
        url: '',
      },
    ]);
    const { t } = useTranslation();
    const CreateApplicationSchema = Yup.object().shape({
      docapp: Yup.string()
        .min(2, t(Localization.Min2Chars))
        .required(t(Localization.FieldRequired)),
      deadline: Yup.date()
        .min(new Date(), t(`${Localization.CreateApplicationModal}.dateNotEarlierThanToday`))
        .required(t(`${Localization.CreateApplicationModal}.chooseEndDate`)),
    });

    useEffect(() => {
      if (idDoc) {
        getDocumetData(idDoc)
          .then((res) => {
            if (res) {
              setDocInfo(res);
              Promise.all(
                res.files.map((item) => {
                  if (authStore.token) {
                    return downloadFile(authStore.token, idDoc, item.id)
                      .then((blob) => {
                        if (blob.type.includes('image')) {
                          return { ...item, url: window.URL.createObjectURL(new Blob([blob])) };
                        } else {
                          return { ...item, url: '' };
                        }
                      })
                      .catch((error) => alertStore.toggleAlert(error));
                  }
                  return undefined;
                })
              )
                .then((res) => {
                  const filteredRes = res.filter((item) => item !== undefined) as {
                    url: string;
                    id: number;
                    name: string;
                  }[];
                  setFilesInfo(filteredRes);
                })
                .catch((error) => alertStore.toggleAlert(error));
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
      const link = document.createElement('a');
      link.href = filesInfo.filter((item) => item.id === fileId)[0].url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      if (link.parentNode) {
        link.parentNode.removeChild(link);
      }
    }

    function handleDownloadDocumentArchive() {
      const zip = new JSZip();
      filesInfo.forEach((file) => {
        zip.file(file.name, file.url);
      });
      zip
        .generateAsync({ type: 'blob' })
        .then((content) => {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(content);
          link.download = 'files.zip';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        })
        .catch((error) => {
          alertStore.toggleAlert(
            t(`${Localization.CreateApplicationModal}.archiveCreationError`) + ' ' + `: ${error}`
          );
        });
    }

    return (
      <Modal
        isOpen={isOpen}
        contentLabel={t(`${Localization.CreateApplicationModal}.modalLabel`)}
        className={styles.modal}
      >
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
                placeholder={t(`${Localization.CreateApplicationModal}.votingNamePlaceholder`)}
                value={values.docapp}
                error={errors.docapp}
                handleChange={handleChange}
                submitCount={submitCount}
              />
              <InputText
                type='datetime-local'
                name='deadline'
                placeholder={t(`${Localization.CreateApplicationModal}.deadlinePlaceholder`)}
                value={values.deadline}
                error={errors.deadline}
                handleChange={handleChange}
                submitCount={submitCount}
              />
              <ul className={stylesApp.listDocs}>
                {t(`${Localization.CreateApplicationModal}.attachedDocuments`)}
                <li>
                  <ul className={stylesApp.listFiles}>
                    <p className={stylesApp.docName} title={docInfo.name}>
                      {docInfo.name}
                    </p>
                    {filesInfo &&
                      filesInfo.map((item) => (
                        <li className={stylesApp.file} key={item.id}>
                          <div className={stylesApp.containerFile}>
                            {item.url && (
                              <img className={stylesApp.image} src={item.url} alt={item.name} />
                            )}
                            <p className={stylesApp.fileName} title={item.name}>
                              {item.name}
                            </p>
                          </div>
                          <button
                            className={stylesApp.button}
                            type='button'
                            onClick={() => handleDownloadDocument(item.id, item.name)}
                          >
                            {t(`${Localization.CreateApplicationModal}.downloadButton`)}
                          </button>
                        </li>
                      ))}
                  </ul>
                </li>
              </ul>
              <button
                type='button'
                className={stylesApp.button}
                onClick={handleDownloadDocumentArchive}
              >
                {t(`${Localization.CreateApplicationModal}.downloadArchiveButton`)}
              </button>
              <button
                type='submit'
                className={styles.button}
                disabled={submitCount >= 1 && !isValid}
              >
                {t(`${Localization.CreateApplicationModal}.createVotingButton`)}
              </button>
            </Form>
          )}
        </Formik>
      </Modal>
    );
  }
);

export default CreateApplicationModal;
