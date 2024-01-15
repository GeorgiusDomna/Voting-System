import TableItem from './TableItem/TableItem';
import UserInfoModal from '../userInfoModal/userInfoModal';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

import userIcon from '@/assets/user.svg';
import departIcon from '@/assets/depart.svg';
import docIcon from '@/assets/docIcon.svg';
import style from './table.module.css';
import IUserInfo from '@/interfaces/userInfo';
import { Paths } from '@/enums/Paths';
import { useTranslation } from 'react-i18next';
import { Localization } from '@/enums/Localization';
import IdataTable from '@/interfaces/IdataTable';
import Pagination from './Pagination/Pagination';

interface Itype_el {
  title?: string;
  th1?: string;
  th2?: string;
  th3?: string;
  th4?: string;
  img?: string;
}

interface ITableProps {
  dataList: IdataTable[][];
  totalPages: number;
  сurrentPage: number;
  setCurrentPage: (current: number) => void;
  type: 'document' | 'department' | 'user';
}

const dateFormater = (inputDate: string): string => {
  return inputDate.split('T')[0].split('-').join('.');
};
const roleCheck = (role: [{ name: string }] | undefined): string => {
  return role && role.find((el) => el.name === 'ROLE_ADMIN') ? 'Admin' : 'User';
};

const Table: React.FC<ITableProps> = ({
  dataList,
  totalPages,
  сurrentPage,
  setCurrentPage,
  type,
}) => {
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
  const { t } = useTranslation();

  function toggleUserInfo() {
    setIsOpenUserInfo(!isOpenUserInfo);
  }

  let type_el: Itype_el = {};
  let tabelItems;
  switch (type) {
    case 'document':
      type_el = {
        th1: t(`${Localization.DocumentTable}.th1`),
        th3: t(`${Localization.DocumentTable}.th3`),
        th4: t(`${Localization.DocumentTable}.th4`),
        img: docIcon,
      };
      break;
    case 'department':
      type_el = {
        th1: t(`${Localization.DepartmentTable}.th1`),
        th2: t(`${Localization.DepartmentTable}.th2`),
        img: departIcon,
      };
      break;
    case 'user':
      type_el = {
        th1: t(`${Localization.UserTable}.th1`),
        th2: t(`${Localization.UserTable}.th2`),
        th4: t(`${Localization.UserTable}.th4`),
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
          td2={data.creationDate && dateFormater(data.creationDate)}
          td3={data.updateDate && dateFormater(data.updateDate)}
          img={type_el.img}
          callback={() => {
            const path =
              data.appId && data.appItemId
                ? `${Paths.DOCUMENTS_TAKE}/${encodeURIComponent(data.id)}/${data.appId}/${
                    data.appItemId
                  }`
                : `${Paths.DOCUMENTS}/${encodeURIComponent(data.id)}`;
            navigate(path);
          }}
        />
      ));
    }
    if (type === 'department') {
      if (dataList.length && dataList[сurrentPage]) {
        tabelItems = dataList[сurrentPage].map((data) => (
          <TableItem
            key={data.id}
            td1={data.name}
            td2={data.amountOfEmployee}
            img={type_el.img}
            callback={() => {
              data.name &&
                navigate(`${Paths.DEPARTMENTS}/${encodeURIComponent(data.name)}/${data.id}`);
            }}
          />
        ));
      }
    }
    if (type === 'user') {
      if (dataList.length && dataList[сurrentPage]) {
        tabelItems = dataList[сurrentPage].map((data) => (
          <TableItem
            key={data.id}
            td1={
              data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : data.username
            }
            td2={roleCheck(data.roles)}
            td3={data.email}
            img={type_el.img}
            callback={() => {
              setUserInfo(data as IUserInfo);
              toggleUserInfo();
            }}
          />
        ));
      }
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
            {type_el.th2 && <th>{type_el.th2}</th>}
            {type_el.th3 && <th>{type_el.th3}</th>}
            {type_el.th4 && <th>{type_el.th4}</th>}
            <th></th>
          </tr>
        </thead>
        <tbody>{tabelItems}</tbody>
      </table>
      <Pagination total={totalPages} сurrent={сurrentPage} setCurrentPage={setCurrentPage} />
      {type === 'user' && isOpenUserInfo && (
        <UserInfoModal isOpen={isOpenUserInfo} toggle={toggleUserInfo} userInfo={userInfo} />
      )}
    </>
  );
};

export default observer(Table);
