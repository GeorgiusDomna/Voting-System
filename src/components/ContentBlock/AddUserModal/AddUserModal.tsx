import Modal from 'react-modal';
import { observer } from 'mobx-react-lite';
import * as Yup from 'yup';
import { Form, Formik, FormikHelpers } from 'formik';

import InputPassword from '@/components/Auth/Inputs/InputPassword';
import InputText from '@/components/Auth/Inputs/InputText';

import alertStore from '@/stores/AlertStore';
import authStore from '@/stores/AuthStore';
import userStore from '@/stores/EmployeeStore';
import { createUser, addUserToDepartment } from '@/api/userService';

import IUser from '@/interfaces/IUser';

import styles from './addUserModal.module.css';
import closeIcon from '@/assets/cancel.svg';

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

const AddUserModal: React.FC<addUserModalProps> = observer(({ isOpen, toggle, departmentId }) => {
  const AddUserSchema = Yup.object().shape({
    username: Yup.string().min(2, 'Минимум 2 символа').required('Поле обязательно для заполнения'),
    password: Yup.string().min(8, 'Минимум 8 символов').required('Поле обязательно для заполнения'),
    email: Yup.string()
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Проверьте правильность email адреса')
      .required('Поле обязательно для заполнения'),
    birthDate: Yup.string().required('Поле обязательно для заполнения'),
    firstName: Yup.string().min(2, 'Минимум 2 символа').required('Поле обязательно для заполнения'),
    lastName: Yup.string().min(2, 'Минимум 2 символа').required('Поле обязательно для заполнения'),
  });

  function handleSubmit(values: userValues, { resetForm }: FormikHelpers<userValues>) {
    const userParams: IUser = {
      ...values,
      position: '',
      patronymic: '',
      roles: [
        {
          name: 'ROLE_USER',
        },
      ],
    };

    if (authStore.token) {
      createUser(userParams, authStore.token)
        .then((data) => {
          addUserToDepartment(
            { userId: data.id as number, departmentId },
            authStore.token as string
          )
            .then(() => {
              userStore.addUser({ ...data, departmentId });
              resetForm();
              alertStore.toggleAlert('Пользователь успешно добавлен');
            })
            .catch((error) => {
              alertStore.toggleAlert((error as Error).message);
            });
        })
        .catch((error) => {
          alertStore.toggleAlert((error as Error).message);
        });
    }
  }

  return (
    <Modal isOpen={isOpen} contentLabel='Модальное окно' className={styles.modal}>
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
                placeholder='Введите login'
                value={values.username}
                error={errors.username}
                handleChange={handleChange}
                submitCount={submitCount}
              />
              <InputPassword
                name='password'
                placeholder='Введите пароль'
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
                placeholder='Введите email'
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
                placeholder='Введите имя'
                value={values.firstName}
                error={errors.firstName}
                handleChange={handleChange}
                submitCount={submitCount}
              />
              <InputText
                type='text'
                name='lastName'
                placeholder='Введите фамилию'
                value={values.lastName}
                error={errors.lastName}
                handleChange={handleChange}
                submitCount={submitCount}
              />
            </div>
            <button type='submit' className={styles.button} disabled={submitCount >= 1 && !isValid}>
              Добавить пользователя
            </button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
});

export default AddUserModal;
