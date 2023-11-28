import { NetworkError } from '@/errors/NetworkError';
import { IFailedServerResponse } from '@/interfaces/IFailedServerResponse';
import departments from '../interfaces/IdepartmentData';
import AddUserToDepartmentParams from '../interfaces/addUserToDepartament';
import CreateUserParams from '../interfaces/CreateUser';
import { IRegistartion, ILogin } from '../interfaces/auth';

import alertStore from '@/stores/AlertStore';
import authStore from '@/stores/AuthStore';

import { isOnline } from '@/utils/networkStatus';

const baseUrl = 'http://5.35.83.142:8082/api/';
const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: `Bearer ${authStore.token}`,
};

export async function CreateUser(params: CreateUserParams) {
  try {
    const response = await fetch(`${baseUrl}user`, {
      method: 'POST',
      headers,
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

export async function createNewDeportment(params: departments) {
  try {
    const response = await fetch(baseUrl + 'department/', {
      method: 'POST',
      headers,
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

export async function addUserToDepartment(params: AddUserToDepartmentParams) {
  try {
    const response = await fetch(baseUrl + `user/${params.userId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(params.departmentId),
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
    alertStore.toggleAlert((error as Error).message);
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
    alertStore.toggleAlert((error as Error).message);
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
    alertStore.toggleAlert((error as Error).message);
  }
}
