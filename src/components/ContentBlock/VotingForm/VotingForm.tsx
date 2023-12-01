import React from 'react';
import { Formik, Form, Field } from 'formik';
import './VotingForm.css'; 

interface VotingFormProps {
  documentId: string;
}

const VotingForm:React.FC<VotingFormProps> = ({ documentId }) => {
  const handleSubmit = (values: { vote: string }) => {
    //  логика для отправки данных на сервер
    console.log(`Документ ID: ${documentId}, Выбор: ${values.vote}`);
  };

  return (
    <div className="form-container">
      <h2 className="form-header">Отправить докумен {documentId} на подписание?</h2>
      <Formik initialValues={{ vote: '' }} onSubmit={handleSubmit}>
        <Form>
          <div className="form-label">
            <label>
              <Field type="radio" name="vote" value="yes" className="form-radio" />
              Да
            </label>
          </div>
          <div className="form-label">
            <label>
              <Field type="radio" name="vote" value="no" className="form-radio" />
              Нет
            </label>
          </div>
          <div>
            <button type="submit" className="form-button">
              Проголосовать
            </button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default VotingForm;
