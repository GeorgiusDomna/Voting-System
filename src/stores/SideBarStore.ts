import { action, makeObservable, observable } from 'mobx';

class SideBarStore {
  /**
   * Флаг, указывающий открыта ли боковая меню
   *
   * @type {boolean}
   * @memberof SideBarStore
   */
  isShown: boolean = false;

  constructor() {
    makeObservable(this, {
      isShown: observable,
      setIsShown: action.bound,
    });
  }

  /**
   * Метод setIsShown изменяет состояние бокового меню, открывая или закрывая его.
   *
   * @memberof SideBarStore
   * @param isShown
   */
  setIsShown(isShown: boolean = false) {
    this.isShown = isShown;
  }
}

const sideBarStore = new SideBarStore();

/**
 * `sideBarStore` - Хранилище состояния бокового меню.
 *
 * `sideBarStore`- Экземпляр класса `SideBarStore`, предоставляющий возможность управления состоянием бокового меню.
 * Содержит флаг `isShown`, указывающий, открыто ли боковое меню.
 * Позволяет открывать и закрывать боковое меню.
 * Реализован с использованием MobX для управления состоянием.
 *
 * @example
 * // Создание нового хранилища бокового меню
 * const sideBarStore = new SideBarStore();
 *
 * // Открытие бокового меню
 * sideBarStore.setIsShown(true);
 *
 * // Закрытие бокового меню
 * sideBarStore.setIsShown();
 */
export default sideBarStore;
