import { observer } from 'mobx-react-lite';

import styles from './departmentItem.module.css';

interface DepartmentItemProps {
  name: string;
  id: string;
}

const DepartmentItem: React.FC<DepartmentItemProps> = observer(({ name }) => {
  return (
    <li className={styles.document}>
      <div className={styles.document__item}>
        <div className={styles.document__titleContainer}>
          {/* <div className={styles.document__iconDocument}></div> */}
          <p className={styles.document__title} title={name}>
            {name}
          </p>
        </div>
        {/* <div className={styles.document__buttons}>
          <button
            className={[styles.document__buttonIcon, styles.document__buttonIcon_type_option].join(
              ' '
            )}
            type='button'
          ></button>
        </div> */}
      </div>
    </li>
  );
});

export default DepartmentItem;
