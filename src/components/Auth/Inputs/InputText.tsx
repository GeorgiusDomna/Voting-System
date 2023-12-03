import { ChangeEvent, useState } from 'react';
import styles from '../auth.module.css';

interface InputTextProps {
  type: 'text' | 'email' | 'date' | 'datetime-local';
  name: string;
  placeholder?: string;
  value: string;
  error: string | undefined;
  handleChange: (e: string | ChangeEvent) => void;
  submitCount: number;
  disabled?: boolean;
}

const InputText = ({
  type,
  name,
  placeholder,
  value,
  error,
  handleChange,
  submitCount,
  disabled,
}: InputTextProps) => {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <label className={styles.label}>
      <input
        type={type}
        name={name}
        className={[
          styles.input,
          `${(isFocus && error) || (submitCount >= 1 && error) ? styles.input_error : ''}`,
        ].join(' ')}
        placeholder={placeholder ?? ''}
        value={value}
        onChange={handleChange}
        onFocus={() => {
          setIsFocus(true);
        }}
        disabled={disabled}
      />
      <p className={styles.error}>{(isFocus && error) || (submitCount >= 1 && error && error)}</p>
    </label>
  );
};

export default InputText;
