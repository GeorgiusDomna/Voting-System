import { useState, useEffect, Fragment } from 'react';
import { observer } from 'mobx-react-lite';

import DocumentItem from './DocumentItem/DocumentItem';
import Loading from './Loading/Loading';
import FormDepartment from './Form/FormDepartment';

import documentStore from '@/stores/DocumentStore';

import styles from './contentBlock.module.css';
import { documents } from '@/dataBase/documents';

const ContentBlock: React.FC = observer(() => {
  const { documentList, setDocumentList } = documentStore;
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setDocumentList(documents);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  if (isLoading) return <Loading type={'spinningBubbles'} color={'#bdbdbd'} />;

  return (
    <div className={styles.contentBlock} data-testid='ContentBlock'>
      <h2 className={styles.contentBlock__title}>Документы</h2>
      <div className={styles.contentBlock__form}>
        <FormDepartment></FormDepartment>
      </div>
      <div className={styles.contentBlock__documentList}>
        {documentList.map((item) => (
          <DocumentItem key={item.id} name={item.name} status={item.status} />
        ))}
      </div>
    </div>
  );
});

export default ContentBlock;
