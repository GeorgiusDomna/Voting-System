import styles from './PageNotFound.module.css';
import notFoundImage from '@/assets/error-page.svg';
const NotFoundPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <img src={notFoundImage} alt='Ошибка 404' style={{ maxWidth: '100%' }} />
      <h1>Страница не найдена</h1>
      <p>
        К сожалению, запрашиваемый вами адрес не найден.
        <br /> Пожалуйста, проверьте правильность введенного адреса или вернитесь на главную
        страницу и повторите попытку позже.
      </p>
      <a href='/' className={styles.button}>
        Главная страница
      </a>
    </div>
  );
};
export default NotFoundPage;
