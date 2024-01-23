import Modal from 'react-modal';
import { observer } from 'mobx-react-lite';
import * as Yup from 'yup';
import { Form, Formik, FormikHelpers } from 'formik';

import InputPassword from '@/components/Auth/Inputs/InputPassword';
import InputText from '@/components/Auth/Inputs/InputText';

import alertStore from '@/stores/AlertStore';
import userStore from '@/stores/EmployeeStore';

import styles from './addUserModal.module.css';
import closeIcon from '@/assets/cancel.svg';

import { useTranslation } from 'react-i18next';
import { Localization } from '@/enums/Localization';

interface addUserModalProps {
  departmentId: number;
  toggle: () => void;
  isOpen: boolean;
}

interface userValues {
  username: string;
  password: string;
  email: string;
  birthDate: string;
  firstName: string;
  lastName: string;
}

if (process.env.NODE_ENV !== 'test') Modal.setAppElement('#root');

const AddUserModal: React.FC<addUserModalProps> = ({ isOpen, toggle, departmentId }) => {
  const { t } = useTranslation();
  const AddUserSchema = Yup.object().shape({
    username: Yup.string()
      .min(2, t(Localization.Min2Chars))
      .required(t(Localization.FieldRequired)),
    password: Yup.string()
      .min(8, t(Localization.Min8Chars))
      .required(t(Localization.FieldRequired)),
    email: Yup.string()
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, t(Localization.CheckEmail))
      .required(t(Localization.FieldRequired)),
    birthDate: Yup.string().required(t(Localization.FieldRequired)),
    firstName: Yup.string()
      .min(2, t(Localization.Min2Chars))
      .required(t(Localization.FieldRequired)),
    lastName: Yup.string()
      .min(2, t(Localization.Min2Chars))
      .required(t(Localization.FieldRequired)),
  });

  async function handleSubmit(values: userValues, { resetForm }: FormikHelpers<userValues>) {
    const res = await userStore.createUser(values, departmentId);
    if (res) {
      resetForm();
      alertStore.toggleAlert(t(`${Localization.AddUserModal}.successMessage`));
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      contentLabel={t(`${Localization.AddUserModal}.modalLabel`)}
      className={styles.modal}
    >
      <img src={closeIcon} className={styles.modal__close} onClick={toggle} />
      <Formik
        initialValues={{
          username: '',
          password: '',
          email: '',
          birthDate: '',
          firstName: '',
          lastName: '',
        }}
        validateOnMount
        validateOnChange
        validationSchema={AddUserSchema}
        onSubmit={handleSubmit}
      >
        {({ handleChange, values, isValid, errors, submitCount }) => (
          <Form className={styles.addUser} name='addUser'>
            <div className={styles.addUser__container}>
              <InputText
                type='text'
                name='username'
                placeholder={t(Localization.EnterLogin)}
                value={values.username}
                error={errors.username}
                handleChange={handleChange}
                submitCount={submitCount}
              />
              <InputPassword
                name='password'
                placeholder={t(Localization.EnterPassword)}
                value={values.password}
                error={errors.password}
                handleChange={handleChange}
                submitCount={submitCount}
              />
            </div>
            <div className={styles.addUser__container}>
              <InputText
                type='email'
                name='email'
                placeholder={t(Localization.EnterEmail)}
                value={values.email}
                error={errors.email}
                handleChange={handleChange}
                submitCount={submitCount}
              />
              <InputText
                type='date'
                name='birthDate'
                value={values.birthDate}
                error={errors.birthDate}
                handleChange={handleChange}
                submitCount={submitCount}
              />
            </div>
            <div className={styles.addUser__container}>
              <InputText
                type='text'
                name='firstName'
                placeholder={t(`${Localization.AddUserModal}.firstNamePlaceholder`)}
                value={values.firstName}
                error={errors.firstName}
                handleChange={handleChange}
                submitCount={submitCount}
              />
              <InputText
                type='text'
                name='lastName'
                placeholder={t(`${Localization.AddUserModal}.lastNamePlaceholder`)}
                value={values.lastName}
                error={errors.lastName}
                handleChange={handleChange}
                submitCount={submitCount}
              />
            </div>
            <button type='submit' className={styles.button} disabled={submitCount >= 1 && !isValid}>
              {t(`${Localization.AddUserModal}.addUserButton`)}
            </button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
};

export default observer(AddUserModal);
