import { NetworkError } from '@/errors/NetworkError';
import { IFailedServerResponse } from '@/interfaces/IFailedServerResponse';
import IUserInfo from '@/interfaces/IUserInfo';

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
 * Получает список сотрудников департамента.
 *
 * @returns {Promise<IUserInfo[] | void>} Промис, который разрешается массивом данных всех сотрудниках департамента.
 * @throws {NetworkError} Если ответ сервера не успешен, вызывается `alertStore.toggleAlert()` с сообщением об ошибке.
 *
 */
export async function getUsersByDepartment(
  id: number,
  page: number = 0,
  limit: number = 30
): Promise<IUserInfo[] | void> {
  try {
    if (!isOnline()) throw new NetworkError();
    const url = `${baseUrl}/department/${id}/users?page=${page}&limit=${limit}&recordState=ACTIVE`;
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
