import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import styles from './adminDocumentPanel.module.css';
import { Paths } from '@/enums/Paths';

const AdminDocumentPanel: React.FC = () => {
  const role: string = 'ADMIN'; //TODO: заменить на роль получаемую после логина
  const navigate = useNavigate();

  useEffect(() => {
    if (role !== 'ADMIN') {
      navigate(Paths.ROOT);
    }
  }, [role, navigate]);

  return <div className={styles.AdminDocumentPanel}>AdminDocumentPanel</div>;
};

export default AdminDocumentPanel;
