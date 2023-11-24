import { observer } from 'mobx-react-lite';

import styles from './documentItem.module.css';

interface DocumentItemProps {
  name: string;
  status: boolean;
}

const DocumentItem: React.FC<DocumentItemProps> = observer(({ name }) => {
  const toggleOption = () => {
    /// При нажатии на кнопку должен быть рутинг на страницу с документом, где можно просмотреть более подробную информацию о нём
  };

  return (
    <li className={styles.document}>
      <div className={styles.document__item}>
        <div className={styles.document__titleContainer}>
          <div className={styles.document__iconDocument}></div>
          <p className={styles.document__title} title={name}>
            {name}
          </p>
        </div>
        <div className={styles.document__buttons}>
          <button
            className={[styles.document__buttonIcon, styles.document__buttonIcon_type_option].join(
              ' '
            )}
            type='button'
            onClick={toggleOption}
          ></button>
        </div>
      </div>
    </li>
  );
});

export default DocumentItem;
