import styles from './userControlPanel.module.css';
//import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const UserControlPanel: React.FC = () => {
  const role: string = 'ADMIN'; //TODO: заменить на роль получаемую после логина

  if (!role) return <Navigate to='/login' />;

  if (role === 'ADMIN') {
    return <div className={styles.UserControlPanel}>UserControlPanel</div>;
  } else return <div>Page not found 404</div>;
};

export default UserControlPanel;
