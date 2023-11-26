import styles from './adminControlPanel.module.css';
//import { useState, useEffect } from 'react';

const AdminControlPanel: React.FC = () => {
  const role: string = 'ADMIN'; //TODO: заменить на роль получаемую после логина

  if (role === 'ADMIN') {
    return <div className={styles.AdminControlPanel}>AdminControlPanel</div>;
  } else return <div>Page not found 404</div>;
};

export default AdminControlPanel;
