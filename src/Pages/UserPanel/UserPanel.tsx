import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useParams } from 'react-router';
import Loading from '@/components/ContentBlock/Loading/Loading';
import Table from '@/components/Table/Table';
import AddUserModal from '@/components/ContentBlock/AddUserModal/AddUserModal';
import { getUsersByDepartment } from '@/api/userService';

import userStore from '@/stores/EmployeeStore';
import alertStore from '@/stores/AlertStore';
import authStore from '@/stores/AuthStore';
import plusIcon from '@/assets/plus.png';
import style from './userPanel.module.css';

const UserPanel: React.FC = () => {
  const { userList, setUserList } = userStore;
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { id, name } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (authStore.userInfo) {
      if (!authStore.isUserAdmin) navigate(Paths.ROOT);
    }
  }, [authStore.userInfo]);

  useEffect(() => {
    const fetchData = async () => {
      if (id) {
        if (authStore.token) {
          const res = await getUsersByDepartment(authStore.token, +id);
          res && setUserList(res);
        }
      } else {
        alertStore.toggleAlert('Ошибка');
        setIsLoading(false);
      }
      setIsLoading(false);
    };
    setIsLoading(true);
    fetchData();
  }, [id]);

  function toggle() {
    setIsOpen(!isOpen);
  }

  return (
    <div className={style.UserPanel}>
      <h2 className={style.UserPanel__title}>{decodeURIComponent(name as string)}</h2>
      <div className={style.UserPanel__controls} onClick={toggle}>
        <img className={style.UserPanel__img} src={plusIcon} alt='+' />
        <button className={style.UserPanel__button}>Добавить пользователя</button>
      </div>
      {isLoading ? (
        <Loading type={'spinningBubbles'} color={'#bdbdbd'} />
      ) : (
        <Table dataList={userList} type='user' />
      )}
      {id && <AddUserModal departmentId={+id} toggle={toggle} isOpen={isOpen} />}
    </div>
  );
};

export default observer(UserPanel);
