export default interface IdataTable {
  creationDate?: string;
  creatorId?: number;
  documentConstructorTypeId?: number;
  fieldsValues?: { [key: string]: string };
  files?: { id: number; name: string }[];
  id: number;
  name: string;
  updateDate?: string;
  amountOfEmployee?: number;
  position?: string;
  username?: string;
  email?: string;
  roles?: [
    {
      name: string;
    },
  ];
  firstName?: string;
  lastName?: string;
  patronymic?: string;
  departmentId?: number;
  birthDate?: string;
}
