import { observer } from 'mobx-react-lite';

import style from './Pagination.module.css';

interface IPagination {
  total: number;
  сurrent: number;
  setCurrentPage: (current: number) => void;
}

const Pagination: React.FC<IPagination> = ({ total, сurrent, setCurrentPage }) => {
  const pagination = [];

  if (total) {
    for (let i = 0; i < total; i++) {
      pagination.push(
        <div
          key={i}
          className={[style.pagination_item, сurrent === i && style.pagination_item_active].join(
            ' '
          )}
          onClick={() => setCurrentPage(i)}
        >
          {i + 1}
        </div>
      );
    }
    return (
      <div className={style.pagination}>
        <div
          className={[style.pagination_item, сurrent === 0 && style.pagination_item_disabled].join(
            ' '
          )}
          onClick={() => setCurrentPage(сurrent - 1)}
        >
          &lt;
        </div>
        {pagination}
        <div
          className={[
            style.pagination_item,
            сurrent === total - 1 && style.pagination_item_disabled,
          ].join(' ')}
          onClick={() => setCurrentPage(сurrent + 1)}
        >
          &gt;
        </div>
      </div>
    );
  }
};

export default observer(Pagination);
