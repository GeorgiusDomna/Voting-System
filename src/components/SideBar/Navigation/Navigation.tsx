import CategoryItem from '../CategoryItem/CategoryItem';
import { observer } from 'mobx-react-lite';
import styles from './navigation.module.css';
import { ReactElement } from 'react';
import { Paths } from '@/enums/Paths';

const Navigation: React.FC = observer(() => {
  const role: string = 'ADMIN'; //TODO: заменить на роль получаемую после логина
  let navItems: ReactElement;

  if (role === 'ADMIN') {
    navItems = (
      <>
        <CategoryItem path={Paths.ROOT} category='Управление персоналом и департаментами' />
        <CategoryItem path={Paths.DOCUMENTS} category='Управление документами' />
      </>
    );
  } else {
    navItems = (
      <>
        <CategoryItem path={Paths.ROOT} category='Просмотр документов' />
        <CategoryItem path={Paths.USER_DOCUMENTS} category='Работа с документами' />
        <CategoryItem path={Paths.DOCUMENTS_VOTE} category='Документы на рассмотрении' />
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
