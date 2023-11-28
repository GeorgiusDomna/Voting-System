import { makeObservable, observable, action } from 'mobx';
import IUserInfo from '@/interfaces/IUserInfo';

class AuthStore {
  /**
   * Объект, содержащий информацию об авторизованном пользователе.
   */
  userInfo: IUserInfo | null = null;
  isLoggedIn: boolean = !!localStorage.getItem('token');
  token: string | null = localStorage.getItem('token');
  role: 'ADMIN' | '' = 'ADMIN'; /// ВРЕМЕННАЯ ЗАГЛУШКА ДЛЯ РАЗРАБОТКИ -------------------

  constructor() {
    makeObservable(this, {
      userInfo: observable,
      isLoggedIn: observable,
      role: observable,
      token: observable,
      setUserInfo: action.bound,
      setIsLoggedIn: action.bound,
      setToken: action.bound,
      deleteToken: action.bound,
      roletoggle: action.bound, /// ВРЕМЕННАЯ ЗАГЛУШКА ДЛЯ РАЗРАБОТКИ -------------------
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

  /// ВРЕМЕННАЯ ЗАГЛУШКА ДЛЯ РАЗРАБОТКИ --------------------
  roletoggle() {
    if (this.role === 'ADMIN') {
      this.role = '';
    } else {
      this.role = 'ADMIN';
    }
  }
}

/**
 * `authStore`- экземпляр класса `AuthStore`, предоставляющий интерфейс для управления данными о пользователе.
 * Каждый пользователь представлен объектом типа `IUserInfo`.
 * Позволяет устанавливать новые данные о пользователе.
 * Реализован с использованием MobX для управления состоянием.
 *
 * @example
 * // Создание нового хранилища информации о пользователе
 * const authStore = new AuthStore();
 *
 *  * // Установка данных о пользователе
 * authStore.setUserInfo({
 *  id: 0;
    position: 'string';
    username: 'string';
    email: 'string';
    ...
 * });
 *
 *  * // Установка данных об авторизации пользователя
 * authStore.setIsLoggedIn(true);
 *
 *  * // Установка токена пользователя
 * authStore.setToken('string');
 *
 *  * // Удаление токена пользователя
 * authStore.deleteToken('string');
 *
 */
const authStore = new AuthStore();

export default authStore;
