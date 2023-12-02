import TableItem from './TableItem/TableItem';
import userInfoModal from '../userInfoModal/userInfoModal';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import IdocumentData from '@/interfaces/IdocumentData';
import IdepartamentData from '@/interfaces/IdepartmentData';

import userIcon from '@/assets/user.svg';
import departIcon from '@/assets/depart.svg';
import docIcon from '@/assets/docIcon.svg';
import style from './table.module.css';
import IUserInfo from '@/interfaces/userInfo';
import { Paths } from '@/enums/Paths';
import UserInfoModal from '../userInfoModal/userInfoModal';

interface Itype_el {
  title?: string;
  th1?: string;
  th2?: string;
  th3?: string;
  th4?: string;
  img?: string;
}

interface ITableProps {
  dataList: IdocumentData[] | IdepartamentData[] | IUserInfo[];
  type: 'document' | 'department' | 'user';
}

const dateFormater = (inputDate: string): string => {
  return inputDate.split('T')[0].split('-').join('.');
};
const roleCheck = (role: { name: string }[]): string => {
  return role.find((el) => el.name === 'ROLE_ADMIN') ? 'Admin' : 'User';
};

const Table: React.FC<ITableProps> = ({ dataList, type }) => {
  const [isOpenUserInfo, setIsOpenUserInfo] = useState(false);
  const [userInfo, setUserInfo] = useState<IUserInfo>({
    id: -1,
    position: '',
    username: '',
    email: '',
    roles: [
      {
        name: '',
      },
    ],
    firstName: '',
    lastName: '',
    patronymic: '',
    departmentId: -1,
    birthDate: '',
  });
  const navigate = useNavigate();

  function toggleUserInfo() {
    setIsOpenUserInfo(!isOpenUserInfo);
  }

  let type_el: Itype_el = {};
  let tabelItems;
  switch (type) {
    case 'document':
      type_el = {
        th1: 'Название',
        th2: 'Автор',
        th3: 'Дата создания',
        th4: 'Обновление',
        img: docIcon,
      };
      break;
    case 'department':
      type_el = {
        th1: 'Название',
        th2: 'Количество сотрудников',
        img: departIcon,
      };
      break;
    case 'user':
      type_el = {
        th1: 'Имя',
        th2: 'Роль',
        th3: 'Департамент',
        th4: 'email',
        img: userIcon,
      };
      break;
  }

  if (!dataList.length) {
    tabelItems = (
      <tr>
        <td colSpan={4} align='center'>
          Документов не найдено.
        </td>
      </tr>
    );
  } else {
    if (type === 'document') {
      tabelItems = dataList.map((data) => (
        <TableItem
          key={data.id}
          td1={data.name}
          td2={data.creatorId}
          td3={dateFormater(data.creationDate)}
          td4={dateFormater(data.updateDate)}
          img={type_el.img}
          callback={() => {
            navigate(`${Paths.DOCUMENTS}/${encodeURIComponent(data.id)}`);
          }}
        />
      ));
    }
    if (type === 'department') {
      tabelItems = dataList.map((data) => (
        <TableItem
          key={data.id}
          td1={data.name}
          td2={data.amountOfEmployee}
          img={type_el.img}
          callback={() => {
            navigate(`${Paths.DEPARTMENTS}/${encodeURIComponent(data.name)}/${data.id}`);
          }}
        />
      ));
    }
    if (type === 'user') {
      tabelItems = dataList.map((data) => (
        <TableItem
          key={data.id}
          td1={data.username}
          td2={roleCheck(data.roles)}
          td3={data.departmentId}
          td4={data.email}
          img={type_el.img}
          callback={() => {
            setUserInfo(data as IUserInfo);
            toggleUserInfo();
          }}
        />
      ));
    }
  }

  return (
    <>
      <table className={style.tabel}>
        <thead>
          <tr className={style.tableHeader}>
            <th className={style.th_name} style={{ paddingLeft: '3.4rem' }}>
              {type_el.th1}
            </th>
            <th>{type_el.th2}</th>
            {type_el.th3 && <th>{type_el.th3}</th>}
            {type_el.th4 && <th>{type_el.th4}</th>}
            <th></th>
          </tr>
        </thead>
        <tbody>{tabelItems}</tbody>
      </table>
      {type === 'user' && (
        <UserInfoModal isOpen={isOpenUserInfo} toggle={toggleUserInfo} userInfo={userInfo} />
      )}
    </>
  );
};

export default observer(Table);
