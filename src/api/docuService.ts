import { NetworkError } from '@/errors/NetworkError';
import { IFailedServerResponse } from '@/interfaces/IFailedServerResponse';
import documentData, { IDocumentResponseDto } from '@/interfaces/IdocumentData';
import ICreateDoc from '@/interfaces/createDoc';
import ICreateFile from '@/interfaces/createFile';

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
 * Получает список документов на странице.
 *
 * @returns {Promise<IDocumentResponseDto[] | void>} Промис, который разрешается массивом данных документов со страницы.
 * @throws {NetworkError} Если ответ сервера не успешен, вызывается `alertStore.toggleAlert()` с сообщением об ошибке.
 *
 */
export async function getDocumentsByPages(
  page: number,
  limit: number,
  token: string
): Promise<IDocumentResponseDto | void> {
  const headersWithToken = { ...headers, Authorization: `Bearer ${token}` };
  try {
    const url = `${baseUrl}/doc/filter?page=${page}&limit=${limit}&state=ACTIVE`;
    if (!isOnline()) throw new NetworkError();
    const response = await fetch(url, {
      method: 'GET',
      headers: headersWithToken,
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
 * Получает данные о документе принимая его id.
 *
 * @returns {Promise<documentData | void>} Промис, который разрешается объектом данных о документе.
 * @throws {NetworkError} Если ответ сервера не успешен, вызывается `alertStore.toggleAlert()` с сообщением об ошибке.
 *
 */
export async function getDocumetData(token: string, id: number): Promise<documentData | void> {
  const headersWithToken = { ...headers, Authorization: `Bearer ${token}` };
  try {
    const url = `${baseUrl}/doc/${id}`;
    if (!isOnline()) throw new NetworkError();
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

/**
 * Создает документ.
 *
 * @returns {Promise<ICreateDoc>} Промис, который разрешается объектом данных о созданном документе.
 * @throws {NetworkError} Если ответ сервера не успешен, вызывается `alertStore.toggleAlert()` с сообщением об ошибке.
 *
 */
export async function createDoc(token: string, value: string): Promise<ICreateDoc> {
  try {
    const url = `${baseUrl}/doc/`;
    if (!isOnline()) throw new NetworkError();
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: value, constructorTypeId: 1 }),
    });
    if (!response.ok) {
      const error: IFailedServerResponse = await response.json();
      throw new Error(error.message);
    }
    return await response.json();
  } catch (error) {
    return Promise.reject('Что-то пошло не так');
  }
}

/**
 * Создает файл в документе.
 *
 * @returns {Promise<ICreateFile>} Промис, который разрешается объектом данных о созданном файле.
 * @throws {NetworkError} Если ответ сервера не успешен, вызывается `alertStore.toggleAlert()` с сообщением об ошибке.
 *
 */
export async function createFile(token: string, docId: number, value: File): Promise<ICreateFile> {
  try {
    const url = `${baseUrl}/doc/${docId}/file/`;
    if (!isOnline()) throw new NetworkError();
    const formData = new FormData();
    formData.append('file', value);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) {
      const error: IFailedServerResponse = await response.json();
      throw new Error(error.message);
    }
    return await response.json();
  } catch (error) {
    return Promise.reject('Что-то пошло не так');
  }
}

/**
 * Скачивает файл в документе.
 *
 * @throws {NetworkError} Если ответ сервера не успешен, вызывается `alertStore.toggleAlert()` с сообщением об ошибке.
 *
 */
export async function downloadFile(token: string, docId: number, fileId: number) {
  try {
    const url = `${baseUrl}/doc/${docId}/file/${fileId}/download`;
    if (!isOnline()) throw new NetworkError();
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: '*/*',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error: IFailedServerResponse = await response.json();
      throw new Error(error.message);
    }
    if (!response.statusText) {
      return await response.blob();
    }
    return await response.json();
  } catch (error) {
    return Promise.reject('Что-то пошло не так');
  }
}
