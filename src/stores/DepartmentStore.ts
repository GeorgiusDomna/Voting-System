import { getDepartmentsByPage } from '@/api/departmentService';
import {
  IDepartmentData,
  IDepartmentInfo,
  IDepartmentResponse,
} from '@/interfaces/DepartmentResponseDto';
import { makeObservable, observable, computed, action } from 'mobx';
import alertStore from './AlertStore';

class DepartmentsStore {
  /**
   * Массив, содержащий метаданные о департаментах. Каждый элемент реализует интерфейс `IDepartmentData`.
   */
  departmentList: IDepartmentData[] = [];
  pageData: IDepartmentData[] = [];
  pageInfo: IDepartmentInfo | undefined;
  isLoading: boolean = false;

  constructor() {
    makeObservable(this, {
      departmentList: observable,
      isLoading: observable,
      pageData: observable,
      pageInfo: observable,
      сurrentPage: computed,
      addNewDepartment: action.bound,
      setCurrentPage: action.bound,
      setDepartments: action.bound,
      setDepartPage: action.bound,
      loadDepartPage: action.bound,
    });
  }

  get сurrentPage() {
    return this.pageInfo?.number ?? 0;
  }

  /**
   * Устанавливает список всех департаментов в хранилище.
   * @param departments - Массив метаданных департаментов для установки в качестве нового списка департаментов.
   */
  setDepartments(departments: IDepartmentData[]) {
    this.departmentList = departments;
  }

  setCurrentPage(current: number) {
    if (this.pageInfo) this.pageInfo.number = current;
  }

  async setDepartPage(res: IDepartmentResponse) {
    this.pageData = res.pageData;
    this.pageInfo = res.pageInfo;
  }

  async loadDepartPage(page: number = 0) {
    this.isLoading = true;
    try {
      const res = await getDepartmentsByPage(page);
      if (res) {
        this.setDepartPage(res);
        this.isLoading = false;
        return true;
      }
    } catch (err) {
      alertStore.toggleAlert((err as Error).message);
    } finally {
      this.isLoading = false;
    }
    return false;
  }

  /**
   * Добавляет новую департамент в список категорий.
   * @param newDepartment - Новые метаданные департамента для добавления в список департаментов.
   */
  addNewDepartment(newDepartment: IDepartmentData) {
    this.departmentList.push(newDepartment);
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
