import { NetworkError } from '@/errors/NetworkError';
import { IFailedServerResponse } from '@/interfaces/IFailedServerResponse';
import departamentData from '@/interfaces/IdepartmentData';
import DepartmentRequestDto from '@/interfaces/DepartmentRequestDto';

import alertStore from '@/stores/AlertStore';

import { isOnline } from '@/utils/networkStatus';

const baseUrl = 'http://5.35.83.142:8082/api';
const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export async function createNewDepartment(params: DepartmentRequestDto, token: string) {
  const headersWithToken = { ...headers, Authorization: `Bearer ${token}` };
  try {
    if (!isOnline()) throw new NetworkError();
    const response = await fetch(baseUrl + 'department/', {
      method: 'POST',
      headers: headersWithToken,
      body: JSON.stringify(params),
    });
    if (!response.ok) {
      const error: IFailedServerResponse = await response.json();
      return Promise.reject(error.message);
    }
    return response.status;
  } catch (error) {
    alertStore.toggleAlert((error as Error).message);
  }
}

/**
 * Получает список всех отделов с сервера.
 *
 * @returns {Promise<departamentData[] | void>} Промис, который разрешается массивом данных об отделах.
 * @throws {NetworkError} Если ответ сервера не успешен, вызывается `alertStore.toggleAlert()` с сообщением об ошибке.
 *
 */
export async function getAllDepartments(token: string): Promise<departamentData[] | void> {
  const headersWithToken = { ...headers, Authorization: `Bearer ${token}` };
  try {
    if (!isOnline()) throw new NetworkError();
    const url = `${baseUrl}/department/`;
    const response = await fetch(url, {
      method: 'GET',
      headers: headersWithToken,
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
