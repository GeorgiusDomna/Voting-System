import { ReactElement, useEffect, useState } from 'react';
import CategoryItem from '../CategoryItem/CategoryItem';
import { observer } from 'mobx-react-lite';
import styles from './navigation.module.css';
import { Paths } from '@/enums/Paths';
import authStore from '@/stores/AuthStore';
import { useTranslation } from 'react-i18next';
import { Localization } from '@/enums/Localization';

const Navigation: React.FC = observer(() => {
  const { t } = useTranslation();
  let navItems: ReactElement;

  if (authStore.isUserAdmin) {
    navItems = (
      <>
        <CategoryItem path={Paths.ROOT} category={t(Localization.ManagementDocuments)} />
        <CategoryItem path={Paths.DEPARTMENTS} category={t(Localization.ManagementDocuments)} />
      </>
    );
  } else {
    navItems = (
      <>
        <CategoryItem path={Paths.ROOT} category={t(Localization.ManagementDocuments)} />
        <CategoryItem path={Paths.DOCUMENTS_VOTE} category={t(Localization.DocumentsInReview)} />
      </>
    );
  }

  return (
    <>
      <h3 className={styles.title}>{t(Localization.FunctionsTitle)}</h3>
      <div className={styles.navigation}>{navItems}</div>
    </>
  );
});

export default Navigation;
