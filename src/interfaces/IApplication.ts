export default interface IApplication {
  id: number;
  name: string;
  creationDate: string;
  deadlineDate: string;
  resultDate: string;
  creatorId: number;
  documentId: number;
  state: string;
  applicationStatus: string;
  applicationItems: [
    {
      id: number;
    },
  ];
}
