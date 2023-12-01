import { NetworkError } from '@/errors/NetworkError';
import { IFailedServerResponse } from '@/interfaces/IFailedServerResponse';
import IUser from '@/interfaces/IUser';
import IUserInfo from '@/interfaces/userInfo';
import AddUserToDepartmentParams from '@/interfaces/addUserToDepartament';

import alertStore from '@/stores/AlertStore';

import { isOnline } from '@/utils/networkStatus';

const baseUrl = 'http://5.35.83.142:8082/api';
const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export async function createUser(params: IUser, token: string) {
  const headersWithToken = { ...headers, Authorization: `Bearer ${token}` };
  try {
    if (!isOnline()) throw new NetworkError();
    const response = await fetch(`${baseUrl}/user/`, {
      method: 'POST',
      headers: headersWithToken,
      body: JSON.stringify(params),
    });
    if (!response.ok) {
      const error: IFailedServerResponse = await response.json();
      return Promise.reject(error.message);
    }
    const createdUser = await response.json();
    return createdUser;
  } catch (error) {
    alertStore.toggleAlert((error as Error).message);
  }
}

export async function addUserToDepartment(
  { userId, departmentId }: AddUserToDepartmentParams,
  token: string
) {
  const headersWithToken = { ...headers, Authorization: `Bearer ${token}` };
  try {
    if (!isOnline()) throw new NetworkError();
    const response = await fetch(`${baseUrl}/user/${userId}`, {
      method: 'PUT',
      headers: headersWithToken,
      body: JSON.stringify({ departmentId }),
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
 * Получает список сотрудников департамента.
 *
 * @returns {Promise<IUserInfo[] | void>} Промис, который разрешается массивом данных всех сотрудниках департамента.
 * @throws {NetworkError} Если ответ сервера не успешен, вызывается `alertStore.toggleAlert()` с сообщением об ошибке.
 *
 */
export async function getUsersByDepartment(
  token: string,
  id: number,
  page: number = 0,
  limit: number = 30
): Promise<IUserInfo[] | void> {
  const headersWithToken = { ...headers, Authorization: `Bearer ${token}` };
  try {
    if (!isOnline()) throw new NetworkError();
    const url = `${baseUrl}/department/${id}/users?page=${page}&limit=${limit}&recordState=ACTIVE`;
    const response = await fetch(url, {
      method: 'GET',
      headers: headersWithToken,
    });
    if (!response.ok) {
      const error: IFailedServerResponse = await response.json();
      return Promise.reject(error.message);
    } else if (response.status === 204) return [];
    const data = await response.json();
    return data.content;
  } catch (error) {
    alertStore.toggleAlert((error as Error).message);
  }
}
