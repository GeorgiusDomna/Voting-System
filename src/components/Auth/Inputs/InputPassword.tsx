import { ChangeEvent, useState } from 'react';
import styles from '../auth.module.css';

interface InputPasswordProps {
  name: string;
  placeholder: string;
  value: string;
  error: string | undefined;
  handleChange: (e: string | ChangeEvent) => void;
  submitCount: number;
}

const InputPassword = ({
  name,
  placeholder,
  value,
  error,
  handleChange,
  submitCount,
}: InputPasswordProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFocus, setIsFocus] = useState(false);

  const toggleVisible = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div className={styles.label}>
      <label
        className={[
          styles.input,
          styles.input_type_password,
          `${(isFocus && error) || (submitCount >= 1 && error) ? styles.input_error : ''}`,
        ].join(' ')}
      >
        <input
          type={isVisible ? 'text' : 'password'}
          name={name}
          className={styles.inputPassword}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          onFocus={() => {
            setIsFocus(true);
          }}
        />
        <button
          type='button'
          className={[
            styles.buttonPassword,
            `${isVisible ? styles.buttonPassword_visible : styles.buttonPassword_hide}`,
          ].join(' ')}
          onClick={toggleVisible}
        ></button>
      </label>
      <p className={styles.error}>{(isFocus && error) || (submitCount >= 1 && error && error)}</p>
    </div>
  );
};

export default InputPassword;
