import { NetworkError } from '@/errors/NetworkError';
import { IFailedServerResponse } from '@/interfaces/IFailedServerResponse';
import { isOnline } from '@/utils/networkStatus';

const baseUrl = 'http://5.35.83.142:8082/api';

/**
 * Создает голосование.
 *
 * @throws {NetworkError} Если ответ сервера не успешен, вызывается `alertStore.toggleAlert()` с сообщением об ошибке.
 *
 */
export async function createApplication(
  token: string,
  value: { name: string; deadlineDate: string }
) {
  try {
    const url = `${baseUrl}/application/`;
    if (!isOnline()) throw new NetworkError();
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(value),
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
 * Прикрепляет документ к голосованию.
 *
 * @throws {NetworkError} Если ответ сервера не успешен, вызывается `alertStore.toggleAlert()` с сообщением об ошибке.
 *
 */
export async function connectDocToApplication(token: string, appId: number, docId: number) {
  try {
    const url = `${baseUrl}/application/${appId}/doc`;
    if (!isOnline()) throw new NetworkError();
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ docId }),
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
