import { ChangeEvent, Dispatch, useState } from 'react';
import styles from './inputUpload.module.css';
import docImage from '@/assets/doc.png';

interface InputUploadProps {
  name: string;
  placeholder?: string;
  value: string;
  error: string | undefined;
  handleChange: (e: string | ChangeEvent) => void;
  submitCount: number;
  images: { image: string; text: string; id: number }[];
  setImages: Dispatch<{ image: string; text: string; id: number }[]>;
  filesImages: { file: File; id: number }[];
  setFiles: Dispatch<{ file: File; id: number }[]>;
  count: number;
  setCount: Dispatch<number>;
}

const InputUpload = ({
  name,
  value,
  error,
  handleChange,
  submitCount,
  images,
  setImages,
  filesImages,
  setFiles,
  count,
  setCount,
}: InputUploadProps) => {
  const [isFocus, setIsFocus] = useState(false);

  const handleChangeFileValue = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const objFile = { file, id: count };
      setFiles([objFile, ...filesImages]);
      const reader = new FileReader();
      reader.onload = function handleFileLoad() {
        const base64Data: string | ArrayBuffer | null = reader.result;
        if (base64Data) {
          let obj;
          if (base64Data.toString().includes('data:application')) {
            obj = { image: docImage, text: file.name, id: count };
          } else {
            obj = { image: base64Data.toString(), text: file.name, id: count };
          }
          setImages([obj, ...images]);
        }
      };
      reader.readAsDataURL(file);
      setCount(count + 1);
    }
  };

  return (
    <>
      <label className={styles.label}>
        <input
          type='file'
          name={name}
          accept='.jpg, .jpeg, .png, .pdf, .docx, .doc, .xls, .txt, .xlsx'
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
          <p className={styles.inputFileBtnName}>Прикрепить файлы</p>
        </div>
      </label>
      <p className={styles.error}>{(isFocus && error) || (submitCount >= 1 && error && error)}</p>
    </>
  );
};

export default InputUpload;
