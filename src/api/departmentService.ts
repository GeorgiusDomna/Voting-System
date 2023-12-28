import { NetworkError } from '@/errors/NetworkError';
import { IFailedServerResponse } from '@/interfaces/IFailedServerResponse';
import { IDepartmentData, IDepartmentResponseDto } from '@/interfaces/IDepartmentData';
import DepartmentRequestDto from '@/interfaces/DepartmentRequestDto';

import alertStore from '@/stores/AlertStore';

import { isOnline } from '@/utils/networkStatus';
import authStore from '@/stores/AuthStore';

const baseUrl = 'http://5.35.83.142:8082/api';
const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: `Bearer ${authStore.token}`,
};

export async function createNewDepartment(params: DepartmentRequestDto, token: string) {
  const headersWithToken = { ...headers, Authorization: `Bearer ${token}` };
  try {
    if (!isOnline()) throw new NetworkError();
    const response = await fetch(baseUrl + '/department/', {
      method: 'POST',
      headers: headersWithToken,
      body: JSON.stringify(params),
    });
    if (!response.ok) {
      const error: IFailedServerResponse = await response.json();
      return Promise.reject(error.message);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    alertStore.toggleAlert((error as Error).message);
  }
}

/**
 * Получает список всех отделов с сервера.
 *
 * @returns {Promise<IDepartmentData[] | void>} Промис, который разрешается массивом данных об отделах.
 * @throws {NetworkError} Если ответ сервера не успешен, вызывается `alertStore.toggleAlert()` с сообщением об ошибке.
 *
 */
export async function getAllDepartments(token: string): Promise<IDepartmentData[] | void> {
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

/**
 * Получает список отделов на странице.
 *
 * @returns {Promise<IDepartmentResponseDto | void>} Промис, который разрешается массивом данных об отделах.
 * @throws {NetworkError} Если ответ сервера не успешен, вызывается `alertStore.toggleAlert()` с сообщением об ошибке.
 *
 */
export async function getDepartmentsByPage(
  page: number,
  limit: number
): Promise<IDepartmentResponseDto | void> {
  try {
    if (!isOnline()) throw new NetworkError();
    const url = `${baseUrl}/department/?page=${page}&limit=${limit}&recordState=ACTIVE`;
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });
    if (!response.ok) {
      const error: IFailedServerResponse = await response.json();
      return Promise.reject(error.message);
    }
    return await response.json();
  } catch (error) {
    alertStore.toggleAlert((error as Error).message);
  }
}

/**
 * Получает объект данных о департаменте.
 *
 * @returns {Promise<IDepartmentData | void>} Промис, который разрешается объект данных о департаменте.
 * @throws {NetworkError} Если ответ сервера не успешен, вызывается `alertStore.toggleAlert()` с сообщением об ошибке.
 *
 */
export async function getDepartmentData(
  id: number,
  token: string
): Promise<IDepartmentData | void> {
  const headersWithToken = { ...headers, Authorization: `Bearer ${token}` };
  try {
    if (!isOnline()) throw new NetworkError();
    const url = `${baseUrl}/department/${id}`;
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

export async function deleteDepartment(id: number, token: string) {
  const headersWithToken = { ...headers, Authorization: `Bearer ${token}` };
  try {
    if (!isOnline()) throw new NetworkError();
    const response = await fetch(baseUrl + '/department/' + id, {
      method: 'DELETE',
      headers: headersWithToken,
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
