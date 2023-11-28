import { observer } from 'mobx-react-lite';
import AddUserModal from '../../AddUserModal/AddUserModal';
import styles from './departmentItem.module.css';
import { useState } from 'react';

interface DepartmentItemProps {
  name: string;
  id: number;
}

const DepartmentItem: React.FC<DepartmentItemProps> = observer(({ name, id }) => {
  const [isOpen, setIsOpen] = useState(false);
  function toggle() {
    setIsOpen(!isOpen);
  }

  return (
    <li className={styles.document}>
      <div className={styles.document__item}>
        <div className={styles.document__titleContainer}>
          <button onClick={toggle}>+</button>
          <AddUserModal isOpen={isOpen} toggle={toggle} departmentId={id} />
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
