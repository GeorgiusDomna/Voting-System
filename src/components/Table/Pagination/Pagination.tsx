import { observer } from 'mobx-react-lite';

import departmentsStore from '@/stores/DepartmentStore';
import EmployeeStore from '@/stores/EmployeeStore';
import DocumentStore from '@/stores/DocumentStore';

import style from './Pagination.module.css';

interface IPagination {
  store: typeof departmentsStore | typeof EmployeeStore | typeof DocumentStore;
}

const Pagination: React.FC<IPagination> = ({ store }) => {
  const { pageInfo, сurrentPage, setCurrentPage } = store;
  const pagination = [];

  if (pageInfo) {
    for (let i = 0; i < pageInfo.totalPages; i++) {
      pagination.push(
        <div
          key={i}
          className={[
            style.pagination_item,
            pageInfo.number === i && style.pagination_item_active,
          ].join(' ')}
          onClick={() => setCurrentPage(i)}
        >
          {i + 1}
        </div>
      );
    }
    return (
      <div className={style.pagination}>
        <div
          className={style.pagination_item}
          onClick={() => сurrentPage > 0 && setCurrentPage(сurrentPage - 1)}
        >
          &lt;
        </div>
        {pagination}
        <div
          className={style.pagination_item}
          onClick={() => сurrentPage < pageInfo.totalPages - 1 && setCurrentPage(сurrentPage + 1)}
        >
          &gt;
        </div>
      </div>
    );
  }
};

export default observer(Pagination);
