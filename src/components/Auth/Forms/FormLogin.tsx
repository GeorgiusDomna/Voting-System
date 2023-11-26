import { Form, Formik } from 'formik';
import InputPassword from '../Inputs/InputPassword';
import InputText from '../Inputs/InputText';
import styles from '../auth.module.css';
import * as Yup from 'yup';

interface valuesLogin {
  loginName: string;
  password: string;
}

const FormLogin = () => {
  const FormLoginSchema = Yup.object().shape({
    loginName: Yup.string().min(2, 'Минимум 2 символа').required('Поле обязательно для заполнения'),
    password: Yup.string().min(8, 'Минимум 8 символов').required('Поле обязательно для заполнения'),
  });

  const handleSubmit = (values: valuesLogin) => {
    console.log(values);
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
      {({ handleChange, values, errors, isValid }) => (
        <Form className={styles.form} name='login'>
          <InputText
            type='text'
            name='loginName'
            placeholder='Введите login'
            value={values.loginName}
            error={errors.loginName}
            handleChange={handleChange}
          />
          <InputPassword
            name='password'
            placeholder='Введите пароль'
            value={values.password}
            error={errors.password}
            handleChange={handleChange}
          />
          <button type='submit' className={styles.button} disabled={!isValid}>
            Войти
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default FormLogin;
