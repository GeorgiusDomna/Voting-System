import { makeObservable, observable, computed, action } from 'mobx';

import documentData from '@/interfaces/IdocumentData';
import { IPaginationInfo } from '@/interfaces/IPaginationInfo';

import authStore from './AuthStore';
import { createDoc, createFile, getDocumentsByPages, getDocumetData } from '@/api/docuService';
import alertStore from './AlertStore';

interface valuesFiles {
  file: File;
  id: number;
}

class DocumentStore {
  /**
   * Cписок всех документов разбитый на страницы. Каждый документ реализует интерфейс `documentData`
   */
  documentPages: documentData[][] = [];
  /**
   * Информация о пагинации.
   */
  paginationInfo: IPaginationInfo = {
    size: 5,
    number: 0,
    totalPages: 1,
  };
  /**
   * Состояние загрузки данных.
   */
  isLoading: boolean = false;

  constructor() {
    makeObservable(this, {
      // Загрузка данных
      loadData: action.bound,

      // Рабора со страницами документов
      documentPages: observable,
      setDocumentList: action.bound,
      createDocument: action.bound,
      addNewDocument: action.bound,
      deleteDocument: action.bound,

      // Пагинация
      paginationInfo: observable,
      currentPage: computed,
      setPaginationInfo: action.bound,
      setCurrentPage: action.bound,

      // Статус загрузки
      isLoading: observable,
      toggleLoading: action.bound,
    });
  }

  /**
   * Индекс открытой страницы (начальное значение 0).
   */
  get currentPage() {
    return this.paginationInfo.number ?? 0;
  }

  /**
   * Получает с сервера данные о документах на открытой странице.
   */
  async loadData() {
    try {
      if (authStore.token && !this.documentPages[this.currentPage]) {
        this.toggleLoading();
        const res = await getDocumentsByPages(
          this.currentPage,
          this.paginationInfo.size,
          authStore.token
        );
        if (res) {
          const { content, ...paginationInfo } = res;
          this.setDocumentList(content);
          this.setPaginationInfo(paginationInfo);
        }
      }
    } catch (err) {
      alertStore.toggleAlert((err as Error).message);
    } finally {
      this.isLoading && this.toggleLoading();
    }
  }

  /**
   * Добавляет данные о документах на загруженной страницы в список со всеми страницами.
   * @param {documentData} documents - Массив данных о документах на загруженной странице.
   */
  setDocumentList(departments: documentData[]) {
    this.documentPages[this.currentPage] = departments;
  }

  /**
   * Создаёт на сервере документ и прикрепляет к нему переданные файлы.
   * @param {string} name - Название создаваемого документа.
   * @param {valuesFiles[]} files - Массив файлов, для при прикрепления к документу.
   * @return {Promise<number | undefined>} В случае успешного создании документа, возвращает его id.
   */
  async createDocument(name: string, files: valuesFiles[]) {
    let result;
    try {
      if (authStore.token) {
        const res = await createDoc(authStore.token, name);
        await Promise.all(
          files.map(async (item) => {
            if (authStore.token) {
              return await createFile(authStore.token, res.id, item.file);
            }
          })
        );
        result = res.id;
        const newDoc = await getDocumetData(authStore.token as string, res.id);
        newDoc && this.addNewDocument(newDoc);
        return result;
      }
    } catch (error) {
      alertStore.toggleAlert((error as Error).message);
    }
  }

  /**
   * Добавляет новый документ в список документов.
   * @param {number} newDepartment - Данные новго документа для добавления в список.
   */
  addNewDocument(newDocument: documentData) {
    const totalPages = this.documentPages.length;
    if (this.documentPages[totalPages - 1].length < this.paginationInfo.size) {
      this.documentPages[totalPages - 1].push(newDocument);
    } else {
      this.documentPages[totalPages] = [newDocument];
      this.paginationInfo.totalPages++;
    }
  }

  /**
   * Удаляет документ из хранилища на основе его имени.
   * @param {number} id - Id документа, который нужно удалить.
   */
  deleteDocument(id: number) {
    for (let i = 0; i < this.documentPages.length; i++) {
      this.documentPages[i] = this.documentPages[i].filter((item) => item.id !== id);
    }
  }

  /**
   * Устанавливает объект данных с информацией о пагинации.
   * @param info - Новый номер текущей страницы.
   */
  setPaginationInfo(info: IPaginationInfo) {
    this.paginationInfo = info;
  }

  /**
   * Изменяет номер текущей страницы.
   * @param current - Новый номер текущей страницы.
   */
  setCurrentPage(current: number) {
    this.paginationInfo.number = current;
  }

  /**
   * Изменяет статус состояние загрузки данных.
   * @return `true` - идёт загрузка, в противном случае `fasle`.
   */
  toggleLoading() {
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
