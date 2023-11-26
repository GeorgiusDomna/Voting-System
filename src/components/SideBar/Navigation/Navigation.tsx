import CategoryItem from '../CategoryItem/CategoryItem';
import { observer } from 'mobx-react-lite';
import styles from './navigation.module.css';
import { ReactElement } from 'react';

const Navigation: React.FC = observer(() => {
  const role: string = 'ADMIN'; //TODO: заменить на роль получаемую после логина
  let navItems: ReactElement;

  if (role === 'ADMIN') {
    navItems = (
      <>
        <CategoryItem path={'/'} category='Управление персоналом' />
        <CategoryItem path={'/departaments'} category='Управление департаментами' />
      </>
    );
  } else {
    navItems = (
      <>
        <CategoryItem path={'/'} category='Просмотр документов' />
        <CategoryItem path={'/create-document'} category='Работа с документами' />
        <CategoryItem path={'/documents-vote'} category='Документы на рассмотрении' />
      </>
    );
  }

  return (
    <>
      <h3 className={styles.title}>Функции</h3>
      <div className={styles.navigation}>{navItems}</div>
    </>
  );
});

export default Navigation;
