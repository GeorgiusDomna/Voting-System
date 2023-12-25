import { NetworkError } from '@/errors/NetworkError';
import { IFailedServerResponse } from '@/interfaces/IFailedServerResponse';
import { isOnline } from '@/utils/networkStatus';

const baseUrl = 'http://5.35.83.142:8082/api';

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

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

/**
 * Отправить голосование в департамент или пользователю.
 *
 * @throws {NetworkError} Если ответ сервера не успешен, вызывается `alertStore.toggleAlert()` с сообщением об ошибке.
 *
 */
export async function sendAppToDepOrUser(
  token: string,
  appId: number,
  value: { toUserId?: number; toDepartmentId: number }[]
) {
  try {
    const url = `${baseUrl}/application/${appId}/applicationItem`;
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

export async function getApplicationItemsByDepartment(
  token: string,
  depId: number,
  page: number = 0,
  limit: number = 30
) {
  const headersWithToken = { ...headers, Authorization: `Bearer ${token}` };
  try {
    const url = `${baseUrl}/department/${depId}/applicationItems?recordState=ACTIVE&limit=${limit}&page=${page}`;
    if (!isOnline()) throw new NetworkError();
    const response = await fetch(url, {
      method: 'GET',
      headers: headersWithToken,
    });
    if (!response.ok) {
      const error: IFailedServerResponse = await response.json();
      throw new Error(error.message);
    }
    if (response.status === 204) return [];
    return await response.json();
  } catch (error) {
    return Promise.reject('Что-то пошло не так');
  }
}

export async function getApplicationItemsByUser(
  token: string,
  userId: number,
  page: number = 0,
  limit: number = 30
) {
  const headersWithToken = { ...headers, Authorization: `Bearer ${token}` };
  try {
    const url = `${baseUrl}/user/${userId}/applicationItems?recordState=ACTIVE&limit=${limit}&page=${page}`;
    if (!isOnline()) throw new NetworkError();
    const response = await fetch(url, {
      method: 'GET',
      headers: headersWithToken,
    });
    if (!response.ok) {
      const error: IFailedServerResponse = await response.json();
      throw new Error(error.message);
    }
    if (response.status === 204) return [];
    return await response.json();
  } catch (error) {
    return Promise.reject('Что-то пошло не так');
  }
}

export async function getApplication(token: string, appId: number) {
  const headersWithToken = { ...headers, Authorization: `Bearer ${token}` };
  try {
    const url = `${baseUrl}/application/${appId}`;
    if (!isOnline()) throw new NetworkError();
    const response = await fetch(url, {
      method: 'GET',
      headers: headersWithToken,
    });
    if (!response.ok) {
      const error: IFailedServerResponse = await response.json();
      throw new Error(error.message);
    }
    if (response.status === 204) return [];
    return await response.json();
  } catch (error) {
    return Promise.reject('Что-то пошло не так');
  }
}

export async function takeApplicationItem(token: string, appItemId: number, appId: number) {
  const headersWithToken = { ...headers, Authorization: `Bearer ${token}` };
  try {
    const url = `${baseUrl}/application/${appId}/applicationItem/${appItemId}/take`;
    if (!isOnline()) throw new NetworkError();
    const response = await fetch(url, {
      method: 'POST',
      headers: headersWithToken,
    });
    if (!response.ok) {
      const error: IFailedServerResponse = await response.json();
      throw new Error(error.message);
    }
    if (response.status === 204) return [];
    const data = await response.json();
    return data;
  } catch (error) {
    return Promise.reject('Что-то пошло не так');
  }
}
