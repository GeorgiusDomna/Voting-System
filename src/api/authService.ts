import { NetworkError } from '@/errors/NetworkError';
import { IFailedServerResponse } from '@/interfaces/IFailedServerResponse';
import { ILogin, IRegistartion } from '@/interfaces/auth';
import { isOnline } from '@/utils/networkStatus';

const baseUrl = 'http://5.35.83.142:8082/api/';

export async function registartion(params: IRegistartion) {
  try {
    if (!isOnline()) throw new NetworkError();
    const response = await fetch(`${baseUrl}registration`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    if (!response.ok) {
      const error: IFailedServerResponse = await response.json();
      return Promise.reject(error.message);
    }
    return await response.json();
  } catch (error) {
    return Promise.reject('Что-то пошло не так');
  }
}

export async function login(params: ILogin) {
  try {
    if (!isOnline()) throw new NetworkError();
    const response = await fetch(`${baseUrl}login`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });
    if (!response.ok) {
      const error: IFailedServerResponse = await response.json();
      return Promise.reject(error.message);
    }
    return await response.json();
  } catch (error) {
    return Promise.reject('Что-то пошло не так');
  }
}

export async function getUserMe(token: string) {
  try {
    if (!isOnline()) throw new NetworkError();
    const response = await fetch(`${baseUrl}user/me`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const error: IFailedServerResponse = await response.json();
      return Promise.reject(error.message);
    }
    return await response.json();
  } catch (error) {
    return Promise.reject('Что-то пошло не так');
  }
}
