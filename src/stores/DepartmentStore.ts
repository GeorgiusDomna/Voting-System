import { makeObservable, observable, computed, action } from 'mobx';

import { IDepartmentData } from '@/interfaces/IDepartmentData';
import { IPaginationInfo } from '@/interfaces/IPaginationInfo';

class DepartmentsStore {
  /**
   * Массив, содержащий метаданные о департаментах. Каждый элемент реализует интерфейс `IDepartmentData`.
   */
  departmentList: IDepartmentData[] = [];
  /**
   * Cписок всех департаментов разбитый на страницы. Каждый департамент реализует интерфейс `IDepartmentData`
   */
  departamentPages: IDepartmentData[][] = [];
  /**
   * Информация о пагинации.
   */
  paginationInfo: IPaginationInfo = {
    size: 10,
    number: 0,
    totalPages: 1,
  };

  constructor() {
    makeObservable(this, {
      // Рабора со списком всех департаментов
      departmentList: observable,
      setDepartments: action.bound,

      // Рабора со страницами департаментов
      departamentPages: observable,
      setDepartmentPage: action.bound,
      addNewDepartment: action.bound,

      // Пагинация
      paginationInfo: observable,
      currentPage: computed,
      setPaginationInfo: action.bound,
      setCurrentPage: action.bound,
    });
  }

  /**
   * Индекс открытой страницы (начальное значение 0).
   */
  get currentPage() {
    return this.paginationInfo.number ?? 0;
  }

  /**
   * Устанавливает список всех департаментов в хранилище.
   * @param departments - Массив метаданных департаментов для установки в качестве нового списка департаментов.
   */
  setDepartments(departments: IDepartmentData[]) {
    this.departmentList = departments;
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
   * Добавляет данные о департаментах на загруженной страницы в список со всеми страницами.
   * @param {IDepartmentData} departments - Массив данных о департаментах на загруженной странице.
   */
  setDepartmentPage(departments: IDepartmentData[]) {
    this.departamentPages[this.currentPage] = departments;
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
