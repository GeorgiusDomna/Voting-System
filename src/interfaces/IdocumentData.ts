export default interface documentData {
  creationDate: string;
  creatorId: number;
  documentConstructorTypeId: number;
  fieldsValues: { [key: string]: string };
  files: string[];
  id: number;
  name: string;
  updateDate: string;
}
