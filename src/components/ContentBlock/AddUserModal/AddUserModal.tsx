// import { useState } from 'react';
import Modal from 'react-modal';
import closeIcon from '@/assets/cancel.svg';
import alertStore from '@/stores/AlertStore';
import { observer } from 'mobx-react-lite';

import * as Yup from 'yup';
import { Form, Formik } from 'formik';

import IUser from '@/interfaces/IUser';
import { createUser, addUserToDepartment } from '@/api/documentService';
import styles from './addUserModal.module.css';

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

  function handleSubmit(values: userValues) {
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

    console.log(userParams);

    createUser(userParams)
      .then((data) => {
        console.log(data);
        //addUserToDepartment({ userId: data.id as number, departmentId }); //TODO: изменение списка юзеров
      })
      .catch((error) => {
        alertStore.toggleAlert((error as Error).message);
      });
  }

  return (
    <Modal isOpen={isOpen} contentLabel='Модальное окно' className={styles.modal}>
      <div className={styles.modal__header}>
        <img src={closeIcon} className={styles.modal__close} onClick={toggle} />
      </div>
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
        {({ handleChange, values, isValid }) => (
          <Form className={styles.addUser} name='addUser'>
            <p>
              <input
                type='text'
                name='username'
                placeholder='Username'
                value={values.username}
                onChange={handleChange}
              />
              <input
                type='password'
                name='password'
                placeholder='Password'
                value={values.password}
                onChange={handleChange}
              />
            </p>
            <p>
              <input
                type='email'
                name='email'
                placeholder='Email'
                value={values.email}
                onChange={handleChange}
              />
              <input
                type='date'
                name='birthDate'
                value={values.birthDate}
                onChange={handleChange}
              />
            </p>
            <p>
              <input
                type='text'
                name='firstName'
                placeholder='Name'
                value={values.firstName}
                onChange={handleChange}
              />
              <input
                type='text'
                name='lastName'
                placeholder='Lastname'
                value={values.lastName}
                onChange={handleChange}
              />
            </p>
            <button type='submit' className={styles.addUser__button} disabled={!isValid}>
              Добавить пользователя
            </button>
          </Form>
        )}
      </Formik>
    </Modal>
  );
});

export default AddUserModal;
