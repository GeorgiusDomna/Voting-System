import { ChangeEvent, Dispatch, useState } from 'react';
import styles from './inputUpload.module.css';

interface InputUploadProps {
  name: string;
  placeholder?: string;
  value: string;
  error: string | undefined;
  handleChange: (e: string | ChangeEvent) => void;
  submitCount: number;
  images: { image: string; text: string }[];
  setImages: Dispatch<{ image: string; text: string }[]>;
  filesImages: File[];
  setFiles: Dispatch<File[]>;
}

const InputUpload = ({
  name,
  // placeholder,
  value,
  error,
  handleChange,
  submitCount,
  images,
  setImages,
  filesImages,
  setFiles,
}: InputUploadProps) => {
  const [isFocus, setIsFocus] = useState(false);

  const handleChangeFileValue = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const reader = new FileReader();
      setFiles([...filesImages, file]);
      reader.onload = function handleFileLoad() {
        const base64Data: string | ArrayBuffer | null = reader.result;
        if (base64Data) {
          const obj = { image: base64Data.toString(), text: file.name };
          setImages([...images, obj]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <label className={styles.label}>
        <input
          type='file'
          name={name}
          accept='image/png'
          className={[
            styles.input,
            `${(isFocus && error) || (submitCount >= 1 && error) ? styles.input_error : ''}`,
          ].join(' ')}
          value={value}
          onChange={(event) => {
            handleChangeFileValue(event);
            handleChange(event);
          }}
          onFocus={() => {
            setIsFocus(true);
          }}
        />
        <div className={styles.containerFlex}>
          <div className={styles.inputFileBtn} />
          <p className={styles.inputFileBtnName}>Выбрать файл</p>
        </div>
      </label>
      <p className={styles.error}>{(isFocus && error) || (submitCount >= 1 && error && error)}</p>
    </>
  );
};

export default InputUpload;
