import { Navigate } from 'react-router-dom';
import styles from './adminControlPanel.module.css';
//import { useState, useEffect } from 'react';

const AdminControlPanel: React.FC = () => {
  const role: string = 'ADMIN'; //TODO: заменить на роль получаемую после логина

  if (role === 'ADMIN') {
    return <div className={styles.AdminControlPanel}>AdminControlPanel</div>;
  } else return <Navigate to='/' />;
};

export default AdminControlPanel;
