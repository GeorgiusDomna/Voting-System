import { ReactElement, useEffect, useState } from 'react';
import CategoryItem from '../CategoryItem/CategoryItem';
import { observer } from 'mobx-react-lite';
import styles from './navigation.module.css';
import { Paths } from '@/enums/Paths';
import authStore from '@/stores/AuthStore';

const Navigation: React.FC = observer(() => {
  const [navItems, setNavItems] = useState<ReactElement>();

  useEffect(() => {
    if (authStore.userInfo && authStore.token) {
      if (authStore.isUserAdmin) {
        setNavItems(
          <>
            <CategoryItem path={Paths.ROOT} category='Управление документами' />
            <CategoryItem path={Paths.DEPARTMENTS} category='Управление департаментами' />
          </>
        );
      } else {
        setNavItems(
          <>
            <CategoryItem path={Paths.ROOT} category='Управление документами' />
            <CategoryItem path={Paths.DOCUMENTS_VOTE} category='Документы на рассмотрении' />
          </>
        );
      }
    }
  }, [authStore.userInfo]);

  return (
    <>
      <h3 className={styles.title}>Функции</h3>
      <div className={styles.navigation}>{navItems}</div>
    </>
  );
});

export default Navigation;
