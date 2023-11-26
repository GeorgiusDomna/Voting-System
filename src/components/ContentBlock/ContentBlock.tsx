import { Outlet } from 'react-router-dom';

import styles from './contentBlock.module.css';

const ContentBlock: React.FC = () => {
  // useEffect(() => {
  //   const fetchData = async () => {
  //     setIsLoading(true);
  //     setDocumentList(documents);
  //     setIsLoading(false);
  //   };
  //   fetchData();
  // }, []);

  // if (isLoading) return <Loading type={'spinningBubbles'} color={'#bdbdbd'} />;

  return (
    <div className={styles.contentBlock}>
      <Outlet />
    </div>
  );
};

export default ContentBlock;
