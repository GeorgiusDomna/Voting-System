import { Form, Formik } from 'formik';
import InputPassword from '../Inputs/InputPassword';
import InputText from '../Inputs/InputText';
import styles from '../auth.module.css';
import * as Yup from 'yup';

import { useNavigate } from 'react-router-dom';
import { Paths } from '@/enums/Paths';
import alertStore from '@/stores/AlertStore';
import { observer } from 'mobx-react-lite';
import userStore from '@/stores/UserStore';
import { useTranslation } from 'react-i18next';
import { Localization } from '@/enums/Localization';
import authStore from '@/stores/AuthStore';
import { login } from '@/api/authService';

interface valuesLogin {
  loginName: string;
  password: string;
}

const FormLogin = observer(() => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const FormLoginSchema = Yup.object().shape({
    loginName: Yup.string()
      .min(2, t(Localization.Min2Chars))
      .required(t(Localization.FieldRequired)),
    password: Yup.string()
      .min(8, t(Localization.Min8Chars))
      .required(t(Localization.FieldRequired)),
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
            placeholder={t(Localization.EnterLogin)}
            value={values.loginName}
            error={errors.loginName}
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
          <button type='submit' className={styles.button} disabled={submitCount >= 1 && !isValid}>
            {t(Localization.LOGIN)}
          </button>
        </Form>
      )}
    </Formik>
  );
});

export default FormLogin;
