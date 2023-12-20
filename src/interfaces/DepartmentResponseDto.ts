import { IPaginationInfo } from './IPaginationInfo';

export interface IDepartmentData {
  id: number;
  name: string;
  amountOfEmployee: number;
}

export interface IDepartmentResponse {
  content: IDepartmentData[];
  paginationInfo: IPaginationInfo;
}
