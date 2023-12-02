import { makeObservable, observable, action } from 'mobx';
import documentData from '@/interfaces/IdocumentData';

class DocumentStore {
  /**
   * Массив, содержащий данные всех документов в хранилище.
   */
  documentList: documentData[] = [];

  constructor() {
    makeObservable(this, {
      documentList: observable,
      setDocumentList: action.bound,
      addDocument: action.bound,
      deleteDocument: action.bound,
    });
  }

  /**
   * Устанавливает список весех документов в хранилище.
   * @param {documentData[]} documentList - Новый список документов для установки.
   */
  setDocumentList(documentList: documentData[]) {
    this.documentList = documentList;
  }

  /**
   * Добавляет новый документ в хранилище документов.
   * @param {documentData} newDocument - Данные нового документа для добавления.
   */
  addDocument(newDocument: documentData) {
    this.documentList.push(newDocument);
  }

  /**
   * Удаляет документ из хранилища на основе его имени.
   * @param {number} id - Id документа, который нужно удалить.
   */
  deleteDocument(id: number) {
    this.documentList = this.documentList.filter((item) => item.id !== id);
  }
}

/**
 * `documentStore`- экземпляр класса `DocumentStore`, предоставляющий интерфейс для управления списком документов.
 * Каждый документ представлен объектом типа `documentData`.
 * Позволяет устанавливать новый список документов, добавлять, удалять и редактировать документы.
 * Реализован с использованием MobX для управления состоянием.
 *
 * @example
 * // Создание нового хранилища документов
 * const documentStore = new DocumentStore();
 *
 *  * // Установка нового списка документов
 * documentStore.setDocumentList([
 *   { id: '1', status: true, name: 'financial report' },
 *   { id: '2', status: false, name: 'Engineering' }
 * ]);
 *
 * // Добавление нового документа
 * documentStore.addDocument({ id: '3', status: true, name: 'feature dev' });
 *
 * // Удаление документа по id
 * documentStore.deleteDocument('2');
 *
 *
 */
const documentStore = new DocumentStore();

export default documentStore;
