import { NetworkError } from '@/errors/NetworkError';
import { IFailedServerResponse } from '@/interfaces/IFailedServerResponse';
import { isOnline } from '@/utils/networkStatus';
import alertStore from '@/stores/AlertStore';
import departments from '../interfaces/departmentsData';
import AddUserToDepartmentParams from '../interfaces/addUserToDepartament';
import GetUserParams from '../interfaces/GetUsers';
import CreateUserParams from '../interfaces/CreateUser';

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
export async function CreateUser(params:CreateUserParams) {
  try{
    const response= await fetch(`${baseUrl}user`,{
      method:'POST',
      headers,
      body:JSON.stringify(params)
    })
    if (!response.ok) {
      const error: IFailedServerResponse = await response.json();
      return Promise.reject(error.message);
    }
    const createdUser = await response.json();
      return createdUser;
  }
  catch(error){
    alertStore.toggleAlert((error as Error).message);
  }
  
}

export async function getUsersByDepartment(params:GetUserParams){ 
  try {
    const response = await fetch(`${baseUrl}user/?departmentName=${params.departmentName}&limit=${params.limit}&page=${params.page}`, {
      method: 'GET',
      headers
    });
    if (!response.ok) {
      const error: IFailedServerResponse = await response.json();
      return Promise.reject(error.message);
    }
    const data =await response.json()
    return data;
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

export async function deleteDocumentOnServer(path: string): Promise<boolean | undefined> {
  let url: string;
  try {
    if (!isOnline()) throw new NetworkError();
    // Формируем URL для удаления файла
     url = baseUrl +`/doc/${path}`;
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
    });
    if (!response.ok) {
      const error: IFailedServerResponse = await response.json();
      throw new Error(error.message);
    }
    return true;
  } catch (error) {
    alertStore.toggleAlert((error as Error).message);
  }
}