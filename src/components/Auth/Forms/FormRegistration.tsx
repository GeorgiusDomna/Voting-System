import { registration, login } from '@/api/documentService';
import styles from '../auth.module.css';
import InputPassword from '../Inputs/InputPassword';
import InputText from '../Inputs/InputText';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import alertStore from '@/stores/AlertStore';
import { useNavigate } from 'react-router-dom';
import { Paths } from '@/enums/Paths';
import { observer } from 'mobx-react-lite';
import userStore from '@/stores/UserStore';

interface valuesLogin {
  loginName: string;
  password: string;
  repeatPassword: string;
  email: string;
}

const FormRegistration = observer(() => {
  const navigate = useNavigate();

  const FormRegistrationSchema = Yup.object().shape({
    loginName: Yup.string().min(2, 'Минимум 2 символа').required('Поле обязательно для заполнения'),
    password: Yup.string().min(8, 'Минимум 8 символов').required('Поле обязательно для заполнения'),
    repeatPassword: Yup.string()
      .required('Поле обязательно для заполнения')
      .oneOf([Yup.ref('password')], 'Пароли не совпадают'),
    email: Yup.string()
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Проверьте правильность email адреса')
      .required('Поле обязательно для заполнения'),
  });

  const handleSubmit = (values: valuesLogin) => {
    registration({
      username: values.loginName,
      password: values.password,
      confirmPassword: values.repeatPassword,
      email: values.email,
    })
      .then(() => {
        login({
          username: values.loginName,
          password: values.password,
        })
          .then((res) => {
            userStore.setToken(res.token);
            navigate(Paths.ROOT);
            userStore.setIsLoggedIn(true);
          })
          .catch((error) => alertStore.toggleAlert(error));
      })
      .catch((error) => alertStore.toggleAlert(error));
  };

  return (
    <Formik
      initialValues={{
        loginName: '',
        password: '',
        repeatPassword: '',
        email: '',
      }}
      validateOnMount
      validateOnChange
      validationSchema={FormRegistrationSchema}
      onSubmit={handleSubmit}
    >
      {({ handleChange, values, errors, isValid, submitCount }) => (
        <Form className={styles.form} name='registration'>
          <InputText
            type='text'
            name='loginName'
            placeholder='Введите login'
            value={values.loginName}
            error={errors.loginName}
            handleChange={handleChange}
            submitCount={submitCount}
          />
          <InputText
            type='email'
            name='email'
            placeholder='Введите email'
            value={values.email}
            error={errors.email}
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
          <InputPassword
            name='repeatPassword'
            placeholder='Повторите пароль'
            value={values.repeatPassword}
            error={errors.repeatPassword}
            handleChange={handleChange}
            submitCount={submitCount}
          />
          <button type='submit' className={styles.button} disabled={submitCount >= 1 && !isValid}>
            Зарегистрироваться
          </button>
        </Form>
      )}
    </Formik>
  );
});

export default FormRegistration;
