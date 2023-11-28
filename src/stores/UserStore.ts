import { makeObservable, observable, action, computed } from 'mobx';
import IUserInfo from '@/interfaces/userInfo';

class UserStore {
  /**
   * Объект, содержащий информацию о пользователе.
   */
  userInfo: IUserInfo | null = null;
  isLoggedIn: boolean = !!localStorage.getItem('token');
  token: string | null = localStorage.getItem('token');

  constructor() {
    makeObservable(this, {
      userInfo: observable,
      isLoggedIn: observable,
      token: observable,
      isUserAdmin: computed,
      setUserInfo: action.bound,
      setIsLoggedIn: action.bound,
      setToken: action.bound,
      deleteToken: action.bound,
    });
  }

  /**
   * Устанавливает информацию о пользователе в хранилище.
   * @param {IUserInfo} userInfo - Данные о пользователе.
   */
  setUserInfo(userInfo: IUserInfo) {
    this.userInfo = userInfo;
  }

  /**
   * Вычисляет, является ли пользователь админом.
   */
  get isUserAdmin() {
    return !!this.userInfo?.roles.find((el) => el.name === 'ROLE_ADMIN');
  }

  /**
   * Устанавливает информацию об авторизации пользователя.
   * @param {boolean} isLoggedIn - Данные об авторизации пользователя.
   */
  setIsLoggedIn(isLoggedIn: boolean) {
    this.isLoggedIn = isLoggedIn;
  }

  /**
   * Устанавливает токен пользователя.
   * @param {string | null} token - Токен пользователя.
   */
  setToken(token: string | null) {
    this.token = token;
    if (token) {
      localStorage.setItem('token', token);
    }
  }

  /**
   * Удаляет токен пользователя.
   */
  deleteToken() {
    this.token = null;
    localStorage.removeItem('token');
  }
}

/**
 * `userStore`- экземпляр класса `UserStore`, предоставляющий интерфейс для управления данными о пользователе.
 * Каждый пользователь представлен объектом типа `IUserInfo`.
 * Позволяет устанавливать новые данные о пользователе.
 * Реализован с использованием MobX для управления состоянием.
 *
 * @example
 * // Создание нового хранилища информации о пользователе
 * const userStore = new UserStore();
 *
 *  * // Установка данных о пользователе
 * userStore.setUserInfo({
 *  id: 0;
    position: 'string';
    username: 'string';
    email: 'string';
    ...
 * });
 *
 *  * // Установка данных об авторизации пользователя
 * userStore.setIsLoggedIn(true);
 *
 *  * // Установка токена пользователя
 * userStore.setToken('string');
 *
 *  * // Удаление токена пользователя
 * userStore.deleteToken('string');
 *
 */
const userStore = new UserStore();

export default userStore;
