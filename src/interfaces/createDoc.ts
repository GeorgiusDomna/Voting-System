export default interface ICreateDoc {
  creationDate: string;
  creatorId: number;
  fieldsValues: { doc: string }[];
  id: number;
  name: string;
  updateDate: string;
}
