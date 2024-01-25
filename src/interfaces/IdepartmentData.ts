import { IPaginationInfo } from './IPaginationInfo';

export interface IDepartmentData {
  name: string;
  id: number;
  amountOfEmployee: number;
}

export interface IDepartmentResponseDto extends IPaginationInfo {
  content: IDepartmentData[];
}
