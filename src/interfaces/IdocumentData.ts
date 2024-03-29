import { IPaginationInfo } from './IPaginationInfo';

export default interface documentData {
  creationDate: string;
  creatorId: number;
  documentConstructorTypeId: number;
  fieldsValues: { [key: string]: string };
  files: { id: number; name: string }[];
  id: number;
  name: string;
  updateDate: string;
}

export interface IDocumentResponseDto extends IPaginationInfo {
  content: documentData[];
}
