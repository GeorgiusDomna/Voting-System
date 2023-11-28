import { Form, Formik } from 'formik';
import InputPassword from '../Inputs/InputPassword';
import InputText from '../Inputs/InputText';
import styles from '../auth.module.css';
import * as Yup from 'yup';

import { useNavigate } from 'react-router-dom';
import { Paths } from '@/enums/Paths';
import alertStore from '@/stores/AlertStore';
import { observer } from 'mobx-react-lite';
import authStore from '@/stores/AuthStore';
import { login } from '@/api/authService';

interface valuesLogin {
  loginName: string;
  password: string;
}

const FormLogin = observer(() => {
  const navigate = useNavigate();

  const FormLoginSchema = Yup.object().shape({
    loginName: Yup.string().min(2, 'Минимум 2 символа').required('Поле обязательно для заполнения'),
    password: Yup.string().min(8, 'Минимум 8 символов').required('Поле обязательно для заполнения'),
  });

  const handleSubmit = (values: valuesLogin) => {
    login({
      username: values.loginName,
      password: values.password,
    })
      .then((res) => {
        authStore.setToken(res.token);
        navigate(Paths.ROOT);
        authStore.setIsLoggedIn(true);
      })
      .catch((error) => alertStore.toggleAlert(error));
  };

  return (
    <Formik
      initialValues={{
        loginName: '',
        password: '',
      }}
      validateOnMount
      validateOnChange
      validationSchema={FormLoginSchema}
      onSubmit={handleSubmit}
    >
      {({ handleChange, values, errors, isValid, submitCount }) => (
        <Form className={styles.form} name='login'>
          <InputText
            type='text'
            name='loginName'
            placeholder='Введите login'
            value={values.loginName}
            error={errors.loginName}
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
          <button type='submit' className={styles.button} disabled={submitCount >= 1 && !isValid}>
            Войти
          </button>
        </Form>
      )}
    </Formik>
  );
});

export default FormLogin;
