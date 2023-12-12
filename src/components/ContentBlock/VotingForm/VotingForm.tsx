import React from 'react';
import { Formik, Form, Field } from 'formik';
import './VotingForm.css'; 
import {handelsubmit} from 'api/applicationService'
interface VotingFormProps {
  token: string
  documentId: number;
  applicationId: number;
}

const VotingForm:React.FC<VotingFormProps> = ({ token, applicationId, documentId }) => {
  const PostServer= (values: { vote: string }) => {
    //  логика для отправки данных на сервер
    const existingStatus = values.vote === 'yes' ? 'ACCEPTED' : 'DENIED';
    const votingValue = {
        status: existingStatus,
        comment: 'Success',
    };
        handelsubmit(token, applicationId, documentId, votingValue)
    .then(result => {
        console.log('Успешный результат:', result);
    })
    .catch(error => {
        console.error('Ошибка:', error);
    });
    console.log(`Документ ID: ${documentId}, Выбор: ${values.vote}`);
  };

  return (
    <div className="form-container">
      <h2 className="form-header">Отправить докумен {documentId} на подписание?</h2>
      <Formik initialValues={{ vote: '' }} onSubmit={PostServer}>
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