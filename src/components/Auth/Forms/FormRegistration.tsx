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
import { useTranslation } from 'react-i18next';
import { Localization } from '@/enums/Localization';

interface valuesLogin {
  loginName: string;
  password: string;
  repeatPassword: string;
  email: string;
}

const FormRegistration = observer(() => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  let test = t(Localization.Min2Chars);
  console.log(test);

  const FormRegistrationSchema = Yup.object().shape({
    loginName: Yup.string()
      .min(2, t(Localization.Min2Chars))
      .required(t(Localization.FieldRequired)),
    password: Yup.string()
      .min(8, t(Localization.Min8Chars))
      .required(t(Localization.FieldRequired)),
    repeatPassword: Yup.string()
      .required(t(Localization.FieldRequired))
      .oneOf([Yup.ref('password')], t(Localization.PasswordsNotMatch)),
    email: Yup.string()
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, t(Localization.CheckEmail))
      .required(t(Localization.FieldRequired)),
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
            placeholder={t(Localization.EnterLogin)}
            value={values.loginName}
            error={errors.loginName}
            handleChange={handleChange}
            submitCount={submitCount}
          />
          <InputText
            type='email'
            name='email'
            placeholder={t(Localization.EnterEmail)}
            value={values.email}
            error={errors.email}
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
          <InputPassword
            name='repeatPassword'
            placeholder={t(Localization.RepeatPassword)}
            value={values.repeatPassword}
            error={errors.repeatPassword}
            handleChange={handleChange}
            submitCount={submitCount}
          />
          <button type='submit' className={styles.button} disabled={submitCount >= 1 && !isValid}>
            {t(Localization.REGISTRATION)}
          </button>
        </Form>
      )}
    </Formik>
  );
});

export default FormRegistration;
