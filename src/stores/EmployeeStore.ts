import { makeObservable, observable, computed, action } from 'mobx';

import { IPaginationInfo } from '@/interfaces/IPaginationInfo';
import IUserInfo, { IUserResponseDto } from '@/interfaces/userInfo';

interface IUserPages {
  [id: string]: {
    pages: IUserInfo[][];
    pagination: IPaginationInfo;
  };
}

class UserStore {
  /**
   * Номер открытого департамента.
   */
  openDepartID: string | null = null;
  /**
   * Массив, содержащий данные всех сотрудниках в хранилище.
   */
  userPages: IUserPages = {};

  constructor() {
    makeObservable(this, {
      // Работа со списками
      openDepartID: observable,
      userPages: observable,
      setOpenDepartID: action.bound,
      setUserList: action.bound,
      addUser: action.bound,
      deleteUser: action.bound,

      // Пагинация
      currentPage: computed,
      totalPages: computed,
      setCurrentPage: action.bound,
    });
  }

  /**
   * Индекс открытой страницы (начальное значение 0).
   */
  get currentPage(): number {
    return (this.openDepartID && this.userPages[this.openDepartID]?.pagination?.number) || 0;
  }
  /**
   * Количество страниц с пользователями в департаменте.
   */
  get totalPages(): number {
    return (this.openDepartID && this.userPages[this.openDepartID]?.pagination?.totalPages) || 1;
  }

  /**
   * Устанавливает ID текущего открытого департамента.
   * @param ID - индеикатор текущего открытого департамента.
   */
  setOpenDepartID(ID: string) {
    this.openDepartID = ID;
  }

  /**
   * Устанавливает список сотрудников на странице и информацию о пагинации.
   * @param {IUserResponseDto} data - объект типа `IUserResponseDto` содержащий в себе массив пользователей на странице и информацию для пагинации.
   */
  setUserList(data: IUserResponseDto) {
    const id = this.openDepartID;
    if (id) {
      if (!(id in this.userPages)) {
        this.userPages[id] = { pages: [], pagination: {} };
      }
      const { content, ...paginationInfo } = data;
      this.userPages[id].pages[this.currentPage] = content;
      this.userPages[id].pagination = paginationInfo;
    }
  }

  /**
   * Добавляет нового сотрудника в список сотрудников.
   * @param {IUserInfo} newUser - Данные о новом сотруднике для добавления.
   * @param {number} id - Индефикатор департамента в который добавляется сотрудник.
   */
  addUser(newUser: IUserInfo, id: number) {
    if (this.userPages[id] && this.userPages[id].pagination) {
      const totalPages = this.userPages[id].pages.length;
      if (this.userPages[id].pages[totalPages - 1].length < this.userPages[id].pagination.size) {
        this.userPages[id].pages[totalPages - 1].push(newUser);
      } else {
        this.userPages[id].pages[totalPages] = [newUser];
        this.userPages[id].pagination.totalPages++;
      }
    }
  }

  /**
   * Удаляет сотрудника из хранилища на основе его id.
   * @param {number} id - Id сотрудника, которого нужно удалить.
   */
  deleteUser(id: number) {
    if (this.openDepartID) {
      this.userPages[this.openDepartID].pages[this.currentPage] = this.userPages[
        this.openDepartID
      ].pages[this.currentPage].filter((user) => user.id !== id);
      !this.userPages[this.openDepartID].pages[this.currentPage].length &&
        this.userPages[this.openDepartID].pagination.totalPages--;
    }
  }

  /**
   * Изменяет номер текущей страницы.
   * @param current - Новый номер текущей страницы.
   */
  setCurrentPage(current: number) {
    if (this.openDepartID) {
      this.userPages[this.openDepartID].pagination.number = current;
    }
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
