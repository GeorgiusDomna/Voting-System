import { NetworkError } from '@/errors/NetworkError';
import { IFailedServerResponse } from '@/interfaces/IFailedServerResponse';
import documentData from '@/interfaces/IdocumentData';

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
 * Получает список всех документов.
 *
 * @returns {Promise<documentData[] | void>} Промис, который разрешается массивом данных всех документов.
 * @throws {NetworkError} Если ответ сервера не успешен, вызывается `alertStore.toggleAlert()` с сообщением об ошибке.
 *
 */
export async function getAllDocuments(token: string): Promise<documentData[] | void> {
  const headersWithToken = { ...headers, Authorization: `Bearer ${token}` };
  try {
    const url = `${baseUrl}/doc/filter?page=0&limit=20&state=ACTIVE`;
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
