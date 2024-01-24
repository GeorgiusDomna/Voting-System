import { makeObservable, observable, computed, action } from 'mobx';

import { IDepartmentData } from '@/interfaces/IdepartmentData';
import IApplicationItem from '@/interfaces/IApplicationItem';
import documentData from '@/interfaces/IdocumentData';

import authStore from './AuthStore';
import { getDepartmentData } from '@/api/departmentService';
import {
  getApplication,
  getApplicationItemsByDepartment,
  getApplicationItemsByUser,
} from '@/api/applicationService';
import { getDocumetData } from '@/api/docuService';
import alertStore from './AlertStore';

interface appItemInfo extends documentData {
  appId: number;
  appItemId: number;
}
type appItemsTemp = {
  appId: number;
  appItemId: number;
};

class VoitingStore {
  /**
   * Информация о департаменте авторизованного сотрудника.
   */
  departamentInfo: IDepartmentData | null = null;

  /**
   * Список всех размещенных заявок на департаменте.
   */
  appItems: IApplicationItem[] = [];
  /**
   * Информация о пагинации.
   */
  userAppItems: IApplicationItem[] = [];

  appItemsList: appItemInfo[] = [];
  /**
   * Состояние загрузки данных.
   */
  isLoading: boolean = false;

  constructor() {
    makeObservable(this, {
      // Загрузка данных
      loadData: action.bound,
      loadDepartInfo: action.bound,
      loadAppItems: action.bound,
      loadUserAppItems: action.bound,
      loadAppItemsList: action.bound,

      departamentInfo: observable,
      appItems: observable,
      userAppItems: observable,
      appItemsList: observable,
      userAppIds: computed,
      setAppItemsList: action.bound,

      // Статус загрузки
      isLoading: observable,
      toggleLoading: action.bound,
    });
  }

  /**
   * Получение заявок закрепленных за текущим юзером.
   */
  get userAppIds(): number[] {
    return this.userAppItems ? this.userAppItems.map((el) => el.id) : [];
  }

  /**
   * Загрузка всех данных необходимых для страницы `DocumentTake`.
   */
  async loadData() {
    if (!this.appItemsList.length) {
      try {
        this.toggleLoading();
        await this.loadDepartInfo();
        await this.loadAppItems();
        await this.loadUserAppItems();
        await this.loadAppItemsList();
        this.toggleLoading();
      } catch (err) {
        alertStore.toggleAlert((err as Error).message);
      }
    }
  }

  /**
   * Загрузка с сервера данных о департаменте авторизованного пользователя.
   */
  async loadDepartInfo() {
    if (authStore.token && authStore.userInfo) {
      const department = await getDepartmentData(authStore.userInfo.departmentId, authStore.token);
      if (department) this.departamentInfo = department;
    }
  }

  /**
   * Загрузка с сервера всех размещенных заявок на департаменте.
   */
  async loadAppItems() {
    if (authStore.token && authStore.userInfo) {
      const appItems: IApplicationItem[] = await getApplicationItemsByDepartment(
        authStore.token,
        authStore.userInfo.departmentId
      );
      if (appItems) this.appItems = appItems;
    }
  }

  /**
   * Загрузка с сервера всех размещенных заявок на департаменте.
   */
  async loadUserAppItems() {
    if (authStore.token && authStore.userInfo) {
      const userAppItems: IApplicationItem[] = await getApplicationItemsByUser(
        authStore.token,
        authStore.userInfo.id
      );
      if (userAppItems) this.userAppItems = userAppItems;
    }
  }

  /**
   * Загрузка с сервера всех размещенных заявок на департамент.
   */
  async loadAppItemsList() {
    if (authStore.token && authStore.userInfo) {
      let appItemsTemp: appItemsTemp[] = [];

      //Убираем ненужные заявки
      if (this.appItems) {
        appItemsTemp = this.appItems
          .filter((el) => {
            if (!el.toUserId && !this.userAppIds.includes(el.applicationId))
              return el.applicationId;
          })
          .map((el) => {
            return { appId: el.applicationId, appItemId: el.id };
          });
      }

      const fetchDocumentData = async (token: string, el: appItemsTemp) => {
        const applicationData = await getApplication(token, el.appId);
        const documentData = await getDocumetData(token, applicationData.documentId);
        return {
          ...(documentData as documentData),
          appId: el.appId,
          appItemId: el.appItemId,
        };
      };

      const fetchAllDocumentData = async (authToken: string, appItemsTemp: appItemsTemp[]) => {
        const promises = appItemsTemp.map((el) => fetchDocumentData(authToken, el));
        return await Promise.all(promises);
      };

      fetchAllDocumentData(authStore.token as string, appItemsTemp as appItemsTemp[])
        .then((allDocumentData) => {
          this.setAppItemsList(allDocumentData);
        })
        .catch((error) => {
          alertStore.toggleAlert((error as Error).message);
        });
    }
  }

  /**
   * Загрузка с сервера всех размещенных заявок на департаменте.
   */
  setAppItemsList(appItemsList: appItemInfo[]) {
    this.appItemsList = appItemsList;
  }

  /**
   * Изменяет статус состояние загрузки данных.
   * @return `true` - идёт загрузка, в противном случае `fasle`.
   */
  toggleLoading() {
    this.isLoading = !this.isLoading;
  }
}

const voitingStore = new VoitingStore();

export default voitingStore;
