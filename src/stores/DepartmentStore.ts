import { makeObservable, observable, computed, action } from 'mobx';

import alertStore from './AlertStore';
import { getDepartmentsByPage } from '@/api/departmentService';

import { IDepartmentData } from '@/interfaces/DepartmentResponseDto';
import { IPaginationInfo } from '@/interfaces/IPaginationInfo';

class DepartmentsStore {
  /**
   * Cписок всех департаментов разбитый на страницы. Каждый департамент реализует интерфейс `IDepartmentData`
   */
  departamentPages: IDepartmentData[][] = [];
  /**
   * Информация о пагинации.
   */
  paginationInfo: IPaginationInfo = {
    size: 2,
    number: 0,
    totalPages: 1,
  };
  /**
   * Статус загрузки.
   */
  isLoading: boolean = false;

  constructor() {
    makeObservable(this, {
      // Получение и установка данных с сервера
      loadDepartData: action.bound,
      setDepartmentList: action.bound,

      // Рабора со списками
      departamentPages: observable,
      addNewDepartment: action.bound,

      // Пагинация
      paginationInfo: observable,
      currentPage: computed,
      setPaginationInfo: action.bound,
      setCurrentPage: action.bound,

      // Статус загрузки
      isLoading: observable,
      toggleIsLoading: action.bound,
    });
  }

  /**
   * Индекс открытой страницы (начальное значение 0).
   */
  get currentPage() {
    return this.paginationInfo.number ?? 0;
  }

  /**
   * Получает список департаментов открытой страницы с сервера.
   */
  async loadDepartData() {
    this.toggleIsLoading();
    try {
      if (!this.departamentPages[this.currentPage]) {
        const res = await getDepartmentsByPage(this.currentPage, this.paginationInfo.size);
        if (res) {
          this.setDepartmentList(res.content);
          this.setPaginationInfo(res.paginationInfo);
          return true;
        }
      }
    } catch (err) {
      alertStore.toggleAlert((err as Error).message);
    } finally {
      this.toggleIsLoading();
    }
    return false;
  }

  /**
   * Добавляет данные о департаментах на загруженной страницы в список со всеми страницами.
   * @param {IDepartmentData} departments - Массив данных о департаментах на загруженной странице.
   */
  setDepartmentList(departments: IDepartmentData[]) {
    this.departamentPages[this.currentPage] = departments;
  }

  /**
   * Добавляет новый департамент в список департаментов.
   * @param {number} newDepartment - Данные новго департамента для добавления в список.
   */
  addNewDepartment(newDepartment: IDepartmentData) {
    const totalPages = this.departamentPages.length;
    if (this.departamentPages[totalPages - 1].length < this.paginationInfo.size) {
      this.departamentPages[totalPages - 1].push(newDepartment);
    } else {
      this.departamentPages[totalPages] = [newDepartment];
      this.paginationInfo.totalPages++;
    }
  }

  /**
   * Добавляет новый департамент в список департаментов.
   * @param {number} newDepartment - Данные новго департамента для добавления в список.
   */
  deleteDepartment(id: number) {
    for (let i = 0; i < this.departamentPages.length; i++) {
      this.departamentPages[i] = this.departamentPages[i].filter((depart) => depart.id !== id);
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
   * Изменяет статус загрузки.
   */
  toggleIsLoading() {
    this.isLoading = !this.isLoading;
  }
}

/**
 * `departmentsStore`- экземпляр класса `DepartmentsStore`, предоставляющий интерфейс для управления списком департаментов.
 * Каждая категория представлена объектом типа `IDepartmentData`.
 * Позволяет устанавливать новый список департаментов и добавлять новые департаменты.
 * Реализован с использованием MobX для управления состоянием.
 *
 * @example
 * // Создание нового хранилища департаментов
 * const departmentsStore = new DepartmentsStore();
 *
 *  * // Установка нового списка департаментов
 * departmentsStore.setDepartments([
 *   { id: 1, name: 'Accounting' },
 *   { id: 2, name: 'Engineering' },
 * ]);
 *
 * // Добавление нового департамента
 * departmentsStore.addNewDepartment({
 *   id: 3, name: 'Development'
 * });
 *
 */
const departmentsStore = new DepartmentsStore();

export default departmentsStore;
