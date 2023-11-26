import { Outlet, Navigate } from 'react-router-dom';
import SideBar from '../SideBar/SideBar';

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

  const role: string = 'ADMIN'; //TODO: заменить на роль получаемую после логина

  if (!role) return <Navigate to='/login' />;

  return (
    <div className={styles.contentBlock}>
      <SideBar />
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default ContentBlock;
