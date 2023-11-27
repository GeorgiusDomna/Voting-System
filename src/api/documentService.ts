import { NetworkError } from '@/errors/NetworkError';
import { IFailedServerResponse } from '@/interfaces/IFailedServerResponse';
import { isOnline } from '@/utils/networkStatus';
import alertStore from '@/stores/AlertStore';
import departments from '../interfaces/departmentsData';
import AddUserToDepartmentParams from '../interfaces/addUserToDepartament';
import GetUserParams from '../interfaces/GetUsers';
import IUser from '../interfaces/IUser';
import { IRegistartion, ILogin } from '../interfaces/auth';

const OAuth_token: string = import.meta.env.VITE_OAUTH_TOKEN;
const baseUrl = 'http://5.35.83.142:8082/api/';

const headers: Headers = new Headers();
headers.set('accept', 'application/json');
headers.set('Content-Type', 'application/json');
headers.set('Authorization', OAuth_token);

/* Проверка сети
  if (!isOnline()) throw new NetworkError();
*/

/* Обработка ошибок
  } catch (error) {
    alertStore.toggleAlert((error as Error).message);
  }
*/
export async function createUser(params: IUser, token: string) {
  try {
    if (!isOnline()) throw new NetworkError();
    const response = await fetch(`${baseUrl}user/`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
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

export async function getUsersByDepartment(params: GetUserParams) {
  try {
    const response = await fetch(
      `${baseUrl}user/?departmentName=${params.departmentName}&limit=${params.limit}&page=${params.page}`,
      {
        method: 'GET',
        headers,
      }
    );
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

export async function createNewDepartment(params: departments, token: string) {
  try {
    if (!isOnline()) throw new NetworkError();
    const response = await fetch(baseUrl + 'department/', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
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
    if (!isOnline()) throw new NetworkError();
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

export async function getAllDepartments(token: string) {
  try {
    if (!isOnline()) throw new NetworkError();
    const response = await fetch(baseUrl + 'department/', {
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
    const data = await response.json();
    return data.content;
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
