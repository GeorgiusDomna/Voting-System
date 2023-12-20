import { makeObservable, observable, computed, action } from 'mobx';
import IUserInfo from '@/interfaces/userInfo';
import { getUsersByDepartment } from '@/api/userService';
import alertStore from './AlertStore';
import { IPaginationInfo } from '@/interfaces/IPaginationInfo';

class UserStore {
  /**
   * Массив, содержащий данные всех сотрудниках в хранилище.
   */
  userPages: IUserInfo[][] | [] = [];
  /**
   * Индекс текущей открытой страницы.
   */
  /**
   * Информация о пагинации.
   */
  paginationInfo: IPaginationInfo = {
    size: 1,
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
      loadEmployeeData: action.bound,
      setUserList: action.bound,

      // Работа со списками
      userPages: observable,
      addUser: action.bound,
      deleteUser: action.bound,

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
   * Получает список всех сотрудников с сервера.
   */
  async loadEmployeeData(id: number) {
    this.toggleIsLoading();
    try {
      if (!this.userPages[this.currentPage]) {
        const res = await getUsersByDepartment(id, this.currentPage, this.paginationInfo.size);
        if (res) {
          console.log(res);
          this.setUserList(res.content);
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
   * Устанавливает список весех сотрудников в хранилище.
   * @param {IUserInfo[]} userList - Новый список сотрудников для установки.
   */
  setUserList(userList: IUserInfo[]) {
    this.userPages[this.currentPage] = userList;
  }

  /**
   * Добавляет нового сотрудника в список сотрудников.
   * @param {IUserInfo} newUser - Данные о новом сотруднике для добавления.
   */
  addUser(newUser: IUserInfo) {
    const totalPages = this.userPages.length;
    if (this.userPages[totalPages - 1].length < this.paginationInfo.size) {
      this.userPages[totalPages - 1].push(newUser);
    } else {
      this.userPages[totalPages] = [newUser];
      this.paginationInfo.totalPages++;
    }
  }

  /**
   * Удаляет сотрудника из хранилища на основе его id.
   * @param {number} id - Id сотрудника, которого нужно удалить.
   */
  deleteUser(id: number) {
    for (let i = 0; i < this.userPages.length; i++) {
      this.userPages[i] = this.userPages[i].filter((user) => user.id !== id);
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
 * `userStore`- экземпляр класса `UserStore`, предоставляющий интерфейс для управления списком сотрудников.
 * Каждый сотрудник представлен объектом типа `IUserInfo`.
 * Позволяет устанавливать новый список сотрудников, добавлять, удалять и редактировать сотрудников.
 * Реализован с использованием MobX для управления состоянием.
 *
 * @example
 * // Создание нового хранилища сотрудников
 * const userStore = new UserStore();
 *
 *  * // Установка нового списка сотрудников
 * userStore.setUserList([
 *   { id: '1', name: 'Egor' },
 *   { id: '2', name: 'Fedot' }
 * ]);
 *
 * // Добавление нового сотрудника
 * userStore.addUser({ id: '3', name: 'Evklid' });
 *
 * // Удаление сотрудника по id
 * userStore.deleteUser('2');
 *
 *
 */
const userStore = new UserStore();

export default userStore;
