import { makeObservable, observable, computed, action } from 'mobx';

import { IPaginationInfo } from '@/interfaces/IPaginationInfo';
import IUserInfo, { IUserResponseDto } from '@/interfaces/userInfo';
import authStore from './AuthStore';
import alertStore from './AlertStore';
import { addUserToDepartment, createUser, getDepartmentUsersByPage } from '@/api/userService';
import IUser from '@/interfaces/IUser';

interface IUserPages {
  [id: string]: {
    pages: IUserInfo[][];
    pagination: IPaginationInfo;
  };
}

interface userValues {
  username: string;
  password: string;
  email: string;
  birthDate: string;
  firstName: string;
  lastName: string;
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
  /**
   * Состояние загрузки данных.
   */
  isLoading: boolean = false;

  constructor() {
    makeObservable(this, {
      // Загрузка данных
      loadData: action.bound,

      // Работа со списками
      openDepartID: observable,
      userPages: observable,
      setOpenDepartID: action.bound,
      setUserList: action.bound,
      addUser: action.bound,
      deleteUser: action.bound,
      moveUser: action.bound,

      // Пагинация
      currentPage: computed,
      totalPages: computed,
      setCurrentPage: action.bound,

      // Статус загрузки
      isLoading: observable,
      toggleLoading: action.bound,
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
   * Получает с сервера данные о документах на открытой странице.
   */
  async loadData() {
    const id = this.openDepartID;
    try {
      if (
        id &&
        authStore.token &&
        (!this.userPages[id] || !this.userPages[id].pages[this.currentPage])
      ) {
        this.toggleLoading();
        const res = await getDepartmentUsersByPage(+id, this.currentPage);
        res && this.setUserList(res);
      }
    } catch (err) {
      alertStore.toggleAlert((err as Error).message);
    } finally {
      this.isLoading && this.toggleLoading();
    }
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
   * Создаёт нового сотрудника и привязывает его к департаменту.
   * @param {userValues} values - Данные о новом сотруднике для добавления.
   * @param {number} id - Индефикатор департамента в который добавляется сотрудник.
   */
  async createUser(values: userValues, id: number) {
    const userParams: IUser = {
      ...values,
      position: '',
      patronymic: '',
      roles: [{ name: 'ROLE_USER' }],
    };

    if (authStore.token) {
      try {
        const data = await createUser(userParams, authStore.token);
        if (data) {
          const res = await addUserToDepartment(
            { userId: data.id as number, departmentId: id },
            authStore.token as string
          );
          if (res) {
            this.addUser(data, id);
            return res;
          }
        }
      } catch (error) {
        alertStore.toggleAlert((error as Error).message);
      }
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
      if (!this.userPages[this.openDepartID].pages[this.currentPage].length) {
        this.userPages[this.openDepartID].pagination.totalPages--;
        this.userPages[this.openDepartID].pagination.number--;
      }
    }
  }

  /**
   * Перемешает сотрудника в между департаментами.
   * @param {IUserInfo} currentInfo - Информация о струднике.
   * @param {number} to - департамента, в который нужно переместить сотрудника.
   */
  async moveUser(currentInfo: IUserInfo, to: number) {
    try {
      if (authStore.token && currentInfo.departmentId !== to) {
        const res = await addUserToDepartment(
          { userId: currentInfo.id, departmentId: to },
          authStore.token
        );
        if (res) {
          this.deleteUser(currentInfo.id);
          this.addUser(currentInfo, to);
          return true;
        }
      }
    } catch (error) {
      alertStore.toggleAlert((error as Error).message);
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

  /**
   * Изменяет статус состояние загрузки данных.
   * @return `true` - идёт загрузка, в противном случае `fasle`.
   */
  toggleLoading() {
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
