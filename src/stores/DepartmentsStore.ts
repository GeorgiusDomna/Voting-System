import departaments from '@/interfaces/DepartmentResponseDto';
import { makeObservable, observable, action } from 'mobx';

class DepartmentsStore {
  /**
   * Массив, содержащий метаданные о департаментах. Каждый элемент реализует интерфейс `departaments`.
   */
  departmentList: departaments[] = [];

  constructor() {
    makeObservable(this, {
      departmentList: observable,
      addNewDepartment: action.bound,
      setDepartments: action.bound,
    });
  }
  /**
   * Устанавливает список всех департаментов в хранилище.
   * @param departments - Массив метаданных департаментов для установки в качестве нового списка департаментов.
   */
  setDepartments(departments: departaments[]) {
    this.departmentList = departments;
  }

  /**
   * Добавляет новую департамент в список категорий.
   * @param newDepartment - Новые метаданные департамента для добавления в список департаментов.
   */
  addNewDepartment(newDepartment: departaments) {
    this.departmentList.push(newDepartment);
  }
}

/**
 * `departmentsStore`- экземпляр класса `DepartmentsStore`, предоставляющий интерфейс для управления списком департаментов.
 * Каждая категория представлена объектом типа `departaments`.
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
