import { ReactElement, useEffect, useState } from 'react';
import CategoryItem from '../CategoryItem/CategoryItem';
import { observer } from 'mobx-react-lite';
import styles from './navigation.module.css';
import { Paths } from '@/enums/Paths';
import authStore from '@/stores/AuthStore';
import { useTranslation } from 'react-i18next';
import { Localization } from '@/enums/Localization';

const Navigation: React.FC = observer(() => {
  const [navItems, setNavItems] = useState<ReactElement>();
  const { t } = useTranslation();

  useEffect(() => {
    if (authStore.userInfo && authStore.token) {
      if (authStore.isUserAdmin) {
        setNavItems(
          <>
            <CategoryItem path={Paths.ROOT} category={t(Localization.ManagementDocuments)} />
            <CategoryItem
              path={Paths.DEPARTMENTS}
              category={t(Localization.ManagementDepartments)}
            />
          </>
        );
      } else {
        setNavItems(
          <>
            <CategoryItem path={Paths.ROOT} category={t(Localization.ManagementDocuments)} />
            <CategoryItem
              path={Paths.DOCUMENTS_VOTE}
              category={t(Localization.DocumentsInReview)}
            />
          </>
        );
      }
    }
  }, [authStore.userInfo]);
  return (
    <>
      <h3 className={styles.title}>{t(Localization.FunctionsTitle)}</h3>
      <div className={styles.navigation}>{navItems}</div>
    </>
  );
});

export default Navigation;
