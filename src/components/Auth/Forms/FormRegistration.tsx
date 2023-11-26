import styles from '../auth.module.css';
import InputPassword from '../Inputs/InputPassword';
import InputText from '../Inputs/InputText';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

interface valuesLogin {
  loginName: string;
  password: string;
  repeatPassword: string;
  email: string;
}

const FormRegistration = () => {
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
    console.log(values);
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
      {({ handleChange, values, errors, isValid }) => (
        <Form className={styles.form} name='registration'>
          <InputText
            type='text'
            name='loginName'
            placeholder='Введите login'
            value={values.loginName}
            error={errors.loginName}
            handleChange={handleChange}
          />
          <InputText
            type='email'
            name='email'
            placeholder='Введите email'
            value={values.email}
            error={errors.email}
            handleChange={handleChange}
          />
          <InputPassword
            name='password'
            placeholder='Введите пароль'
            value={values.password}
            error={errors.password}
            handleChange={handleChange}
          />
          <InputPassword
            name='repeatPassword'
            placeholder='Повторите пароль'
            value={values.repeatPassword}
            error={errors.repeatPassword}
            handleChange={handleChange}
          />
          <button type='submit' className={styles.button} disabled={!isValid}>
            Зарегистрироваться
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default FormRegistration;
