import { NetworkError } from '@/errors/NetworkError';
import { isOnline } from '@/utils/networkStatus';
import alertStore from '@/stores/AlertStore';

const OAuth_token: string = import.meta.env.VITE_OAUTH_TOKEN;
const baseUrl = 'baseUrl';

const headers: Headers = new Headers();
headers.set('Authorization', OAuth_token);

/* Проверка сети
  if (!isOnline()) throw new NetworkError();
*/

/* Обработка ошибок
  } catch (error) {
    alertStore.toggleAlert((error as Error).message);
  }
*/
