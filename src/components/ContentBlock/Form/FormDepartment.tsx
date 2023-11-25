import { observer } from 'mobx-react-lite';

import styles from './formDepartment.module.css';

const FormDepartment: React.FC = observer(() => {
  return (
    <>
      <form action='post' className={styles.formDepartment}>
        <input
          type='text'
          name='newDepartment'
          id='newDepartment'
          className={styles.inputName}
          placeholder='Название нового департамента'
        />
        <button className={styles.btn}>Создать</button>
      </form>
    </>
  );
});

export default FormDepartment;
