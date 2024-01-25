import { useTranslation } from 'react-i18next';
import { Paths } from '@/enums/Paths';
import { Localization } from '@/enums/Localization';

import styles from './notFoundPage.module.css';
import notFoundImage from '@/assets/error-page.svg';

const NotFoundPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <img src={notFoundImage} alt='Ошибка 404' style={{ maxWidth: '100%' }} />
      <h1>{t(`${Localization.NotFoundPage}.title`)}</h1>
      <p>{t(`${Localization.NotFoundPage}.discription`)}</p>
      <a href={Paths.ROOT} className={styles.button}>
        {t(`${Localization.NotFoundPage}.button`)}
      </a>
    </div>
  );
};
export default NotFoundPage;
