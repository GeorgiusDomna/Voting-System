import { NetworkError } from '@/errors/NetworkError';
import { IFailedServerResponse } from '@/interfaces/IFailedServerResponse';
import IUser from '@/interfaces/IUser';
import IUserInfo, { IUserResponse } from '@/interfaces/userInfo';
import AddUserToDepartmentParams from '@/interfaces/addUserToDepartament';

import alertStore from '@/stores/AlertStore';

import { isOnline } from '@/utils/networkStatus';
import authStore from '@/stores/AuthStore';

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

export async function deleteUser(id: number, token: string) {
  const headersWithToken = { ...headers, Authorization: `Bearer ${token}` };
  try {
    if (!isOnline()) throw new NetworkError();
    const url = `${baseUrl}/user/${id}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers: headersWithToken,
    });
    if (!response.ok) {
      const error: IFailedServerResponse = await response.json();
      throw new Error(error.message);
    }
    return response.status;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

/**
 * Получает данные о сотруднике.
 *
 * @returns {Promise<IUserInfo[] | void>} Промис, который разрешается объектом типа `IUserInfo` данных о сотруднике.
 * @throws {NetworkError} Если ответ сервера не успешен, вызывается `alertStore.toggleAlert()` с сообщением об ошибке.
 *
 */
export async function getUserInfo(id: number, token: string): Promise<IUserInfo | void> {
  const headersWithToken = { ...headers, Authorization: `Bearer ${token}` };
  try {
    if (!isOnline()) throw new NetworkError();
    const url = `${baseUrl}/user/${id}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: headersWithToken,
    });
    if (!response.ok) {
      const error: IFailedServerResponse = await response.json();
      throw new Error(error.message);
    }
    return await response.json();
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
    throw new Error((error as Error).message);
  }
}

/**
 * Получает список сотрудников департамента.
 *
 * @returns {Promise<IUserResponse | void>} Промис, который разрешается массивом данных всех сотрудниках департамента.
 * @throws {NetworkError} Если ответ сервера не успешен, вызывается `alertStore.toggleAlert()` с сообщением об ошибке.
 *
 */
export async function getUsersByDepartment(
  id: number,
  current: number,
  size: number
): Promise<IUserResponse | void> {
  const headersWithToken = { ...headers, Authorization: `Bearer ${authStore.token}` };
  try {
    if (!isOnline()) throw new NetworkError();
    const url = `${baseUrl}/department/${id}/users?page=${current}&limit=${size}&recordState=ACTIVE`;
    const response = await fetch(url, {
      method: 'GET',
      headers: headersWithToken,
    });
    if (!response.ok) {
      const error: IFailedServerResponse = await response.json();
      return Promise.reject(error.message);
    } else if (response.status === 204)
      return {
        content: [],
        paginationInfo: {
          size,
          number: 0,
          totalPages: 1,
        },
      };
    const { content, ...paginationInfo } = await response.json();
    return {
      content,
      paginationInfo,
    };
  } catch (error) {
    throw new Error((error as Error).message);
  }
}
