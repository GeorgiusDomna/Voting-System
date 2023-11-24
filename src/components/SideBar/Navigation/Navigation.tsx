import CategoryItem from '../CategoryItem/CategoryItem';
import { observer } from 'mobx-react-lite';
import styles from './navigation.module.css';

const Navigation: React.FC = observer(() => {
  return (
    <>
      <h3 className={styles.title}>Функции</h3>
      <div className={styles.navigation}>
        <CategoryItem path={'/'} category='Документы' />
        <CategoryItem path={'/departaments'} category='Управление департаментами' />
        <CategoryItem path={'/staffs'} category='Управление персоналом' />
        <CategoryItem path={'/create'} category='Работа с документами' />
      </div>
    </>
  );
});

export default Navigation;
