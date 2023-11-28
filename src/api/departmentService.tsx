import { NetworkError } from '@/errors/NetworkError';
import { IFailedServerResponse } from '@/interfaces/IFailedServerResponse';
import departamentData from '@/interfaces/IdepartmentData';

import alertStore from '@/stores/AlertStore';
import userStore from '@/stores/AuthStore';

import { isOnline } from '@/utils/networkStatus';

const baseUrl = 'http://5.35.83.142:8082/api';
const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: `Bearer ${userStore.token}`,
};

/**
 * Получает список всех отделов с сервера.
 *
 * @returns {Promise<departamentData[] | void>} Промис, который разрешается массивом данных об отделах.
 * @throws {NetworkError} Если ответ сервера не успешен, вызывается `alertStore.toggleAlert()` с сообщением об ошибке.
 *
 */
export async function getAllDepartments(): Promise<departamentData[] | void> {
  try {
    if (!isOnline()) throw new NetworkError();
    const url = `${baseUrl}/department/`;
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });
    if (!response.ok) {
      const error: IFailedServerResponse = await response.json();
      return Promise.reject(error.message);
    }
    const data = await response.json();
    return data.content;
  } catch (error) {
    alertStore.toggleAlert((error as Error).message);
  }
}