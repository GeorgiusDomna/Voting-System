import { ReactElement } from 'react';
import CategoryItem from '../CategoryItem/CategoryItem';
import { observer } from 'mobx-react-lite';
import userStore from '@/stores/UserStore';
import styles from './navigation.module.css';
import { Paths } from '@/enums/Paths';
import authStore from '@/stores/AuthStore';

const Navigation: React.FC = observer(() => {
  let navItems: ReactElement;

  if (userStore.isUserAdmin) {
    navItems = (
      <>
        <CategoryItem path={Paths.ROOT} category='Управление документами' />
        <CategoryItem path={Paths.ADMIN_PANEL} category='Управление персоналом и департаментами' />
      </>
    );
  } else {
    navItems = (
      <>
        <CategoryItem path={Paths.ROOT} category='Управление документами' />
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
