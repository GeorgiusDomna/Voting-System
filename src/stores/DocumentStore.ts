import { makeObservable, observable, computed, action } from 'mobx';

import alertStore from './AlertStore';
import { getAllDocuments } from '@/api/docuService';
import { createTwoLevelArr } from '@/utils/createMultiLevelArr';

import documentData from '@/interfaces/IdocumentData';

class DocumentStore {
  /**
   * Массив, содержащий данные всех документов в хранилище.
   */
  documentList: documentData[] = [];
  /**
   * Индекс текущей открытой страницы.
   */
  сurrentPage: number = 0;
  /**
   * Статус загрузки.
   */
  isLoading: boolean = false;

  constructor() {
    makeObservable(this, {
      // Получение и установка данных с сервера
      loadDocumentData: action.bound,
      setDocumentList: action.bound,

      // Работа со списками
      documentList: observable,
      documentPages: computed,
      addDocument: action.bound,
      deleteDocument: action.bound,

      // Пагинация
      сurrentPage: observable,
      setCurrentPage: action.bound,

      // Статус загрузки
      isLoading: observable,
      toggleIsLoading: action.bound,
    });
  }

  /**
   * Разбивает список всех документов на страницы размером не более 10 элементов.
   */
  get documentPages() {
    return createTwoLevelArr(this.documentList, 10);
  }

  /**
   * Получает список всех документов с сервера.
   */
  async loadDocumentData() {
    this.toggleIsLoading();
    try {
      const res = await getAllDocuments();
      if (res) {
        this.setDocumentList(res);
        return true;
      }
    } catch (err) {
      alertStore.toggleAlert((err as Error).message);
    } finally {
      this.toggleIsLoading();
    }
    return false;
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

  /**
   * Изменяет номер текущей страницы.
   * @param current - Новый номер текущей страницы.
   */
  setCurrentPage(current: number) {
    this.сurrentPage = current;
  }

  /**
   * Изменяет статус загрузки.
   */
  toggleIsLoading() {
    this.isLoading = !this.isLoading;
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
