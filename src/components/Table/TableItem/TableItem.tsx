import { observer } from 'mobx-react-lite';
import style from './tableItem.module.css';
import option from '@/assets/option.svg';

interface ITabelItemProps {
  td1: string | undefined;
  td2: number | string | undefined;
  td3?: string | undefined;
  td4?: string | undefined;
  img: string | undefined;
  callback: () => void;
}

const TableItem = ({ td1, td2, td3, td4, img, callback }: ITabelItemProps) => {
  return (
    <tr className={style.listItem}>
      <td>
        <div className={style.nameContainer}>
          <img className={style.logoItem} src={img} />
          <div className={style.name}>{td1}</div>
        </div>
      </td>
      <td>{td2}</td>
      {td3 && <td>{td3}</td>}
      {td4 && <td>{td4}</td>}
      <td className={style.btnOption}>
        <img className={style.logoItem_option} src={option} onClick={callback} />
      </td>
    </tr>
  );
};

export default observer(TableItem);
