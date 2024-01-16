import { IPaginationInfo } from './IPaginationInfo';

export default interface IUserInfo {
  id: number;
  position: string;
  username: string;
  email: string;
  roles: [
    {
      name: string;
    },
  ];
  firstName: string;
  lastName: string;
  patronymic: string;
  departmentId: number;
  birthDate: string;
}

export interface IUserResponseDto extends IPaginationInfo {
  content: IUserInfo[];
}
