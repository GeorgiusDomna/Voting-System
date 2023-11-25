import { NetworkError } from '@/errors/NetworkError';
import { IFailedServerResponse } from '@/interfaces/IFailedServerResponse';
import { isOnline } from '@/utils/networkStatus';
import alertStore from '@/stores/AlertStore';
import departments from '../interfaces/departmentsData';
import AddUserToDepartmentParams from '../interfaces/addUserToDepartament';

const OAuth_token: string = import.meta.env.VITE_OAUTH_TOKEN;
const baseUrl = 'http://5.35.83.142:8082/api/';

const headers: Headers = new Headers();
headers.set('Accept', 'application/json');
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
