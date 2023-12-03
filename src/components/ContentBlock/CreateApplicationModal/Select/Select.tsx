import { ChangeEvent, Dispatch, SetStateAction, useState } from 'react';
import { userDoc } from '../CreateApplicationModal';
import stylesSelect from './select.module.css';

const Select = ({
  name,
  placeholder,
  arrayUserDocs,
  value,
  error,
  handleChange,
  submitCount,
  disabled,
  setId,
}: {
  name: string;
  value: string;
  error: string | undefined;
  handleChange: (e: string | ChangeEvent) => void;
  submitCount: number;
  placeholder: string;
  arrayUserDocs: userDoc[];
  setId: Dispatch<SetStateAction<number | null>>;
  disabled?: boolean;
}) => {
  const [isFocus, setIsFocus] = useState(false);

  return (
    <div className={stylesSelect.label}>
      <select
        name={name}
        className={stylesSelect.select}
        onChange={(e) => {
          handleChange(e);
          setId(() => Number(e.target.value));
        }}
        value={value}
        disabled={disabled}
        onFocus={() => {
          setIsFocus(true);
        }}
      >
        <option value='' disabled hidden>
          {placeholder}
        </option>
        {arrayUserDocs.map((item: userDoc) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>
      <p className={stylesSelect.error}>
        {(isFocus && error) || (submitCount >= 1 && error && error)}
      </p>
    </div>
  );
};

export default Select;
