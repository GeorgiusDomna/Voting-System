import { makeObservable, observable, computed, action } from 'mobx';

import authStore from './AuthStore';
import alertStore from './AlertStore';
import {
  createNewDepartment,
  deleteDepartment,
  getDepartmentsByPage,
} from '@/api/departmentService';

import DepartmentRequestDto from '@/interfaces/DepartmentRequestDto';
import { IDepartmentData } from '@/interfaces/IDepartmentData';
import { IPaginationInfo } from '@/interfaces/IPaginationInfo';
import { deleteUser, getUsersByDepartment } from '@/api/userService';
import IUserInfo from '@/interfaces/userInfo';

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
  /**
   * Состояние загрузки данных.
   */
  isLoading: boolean = false;

  constructor() {
    makeObservable(this, {
      // Загрузка данных
      loadData: action.bound,

      // Рабора со списком всех департаментов
      departmentList: observable,
      setDepartments: action.bound,

      // Рабора со страницами департаментов
      departamentPages: observable,
      setDepartmentPage: action.bound,
      createNewDepartment: action.bound,
      addNewDepartment: action.bound,
      deleteUsersByDepart: action.bound,
      deleteDepart: action.bound,

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
      if (authStore.token && !this.departamentPages[this.currentPage]) {
        this.toggleLoading();
        const res = await getDepartmentsByPage(
          this.currentPage,
          this.paginationInfo.size,
          authStore.token
        );
        if (res) {
          const { content, ...paginationInfo } = res;
          this.setDepartmentPage(content);
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
   * Устанавливает список всех департаментов в хранилище.
   * @param departments - Массив метаданных департаментов для установки в качестве нового списка департаментов.
   */
  setDepartments(departments: IDepartmentData[]) {
    this.departmentList = departments;
  }

  /**
   * Создаёт новый департамент на сервере и добавляет его в список департаментов.
   * @param {string} name - Название создаваемого департамента.
   * @return {Promise<number | undefined>} В случае успешного создании департамента, возвращает `true`.
   */
  async createNewDepartment(name: string) {
    try {
      const newDep: DepartmentRequestDto = {
        name,
      };
      if (authStore.token) {
        const newDepart = await createNewDepartment(newDep, authStore.token);
        if (newDepart) {
          this.addNewDepartment(newDepart);
          return true;
        }
      }
    } catch (error) {
      alertStore.toggleAlert((error as Error).message);
    }
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
   * Удаляет всех сотрудников из указанного департамента.
   * @param {number} id - Индификатор департамента, из которого нужно удалить всех сотрудников.
   */
  async deleteUsersByDepart(id: number) {
    if (authStore.token) {
      try {
        const data = await getUsersByDepartment(authStore.token, id);
        if (data) {
          const userArr = data as IUserInfo[];
          userArr.forEach((user) => {
            deleteUser(user.id as number, authStore.token as string).catch((error) => {
              alertStore.toggleAlert((error as Error).message);
            });
          });
        }
      } catch (error) {
        alertStore.toggleAlert((error as Error).message);
      }
    }
  }

  /**
   * Удаляет департамент по указанному индефикатору.
   * @param {number} id - Индификатор департамента, который нужно удалить.
   * @return {true | undefined} В случае успешного уделения департамента возвращает `true`.
   */
  async deleteDepart(id: number) {
    if (authStore.token) {
      try {
        const res = await deleteDepartment(id, authStore.token);
        if (res) {
          alertStore.toggleAlert('Успешно удалено');
          for (let i = 0; i < this.departamentPages.length; i++) {
            this.departamentPages[i] = this.departamentPages[i].filter((item) => item.id !== id);
          }
          if (!this.departamentPages[this.departamentPages.length]) {
            this.setCurrentPage(this.currentPage - 1);
            this.paginationInfo.totalPages--;
          }
          return true;
        }
      } catch (error) {
        alertStore.toggleAlert((error as Error).message);
      }
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

  /**
   * Изменяет статус состояние загрузки данных.
   * @return `true` - идёт загрузка, в противном случае `fasle`.
   */
  toggleLoading() {
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
