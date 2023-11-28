import { makeObservable, observable, action } from 'mobx';
import IUserInfo from '@/interfaces/IUserInfo';

class UserStore {
  /**
   * Массив, содержащий данные всех сотрудниках в хранилище.
   */
  userList: IUserInfo[] = [];

  constructor() {
    makeObservable(this, {
      userList: observable,
      setUserList: action.bound,
      addUser: action.bound,
      deleteUser: action.bound,
    });
  }

  /**
   * Устанавливает список весех сотрудников в хранилище.
   * @param {IUserInfo[]} userList - Новый список сотрудников для установки.
   */
  setUserList(userList: IUserInfo[]) {
    this.userList = userList;
  }

  /**
   * Добавляет нового сотрудника в хранилище сотрудников.
   * @param {IUserInfo} newUser - Данные о новом сотруднике для добавления.
   */
  addUser(newUser: IUserInfo) {
    this.userList.push(newUser);
  }

  /**
   * Удаляет сотрудника из хранилища на основе его id.
   * @param {number} id - Id сотрудника, которого нужно удалить.
   */
  deleteUser(id: number) {
    this.userList = this.userList.filter((item) => item.id !== id);
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
