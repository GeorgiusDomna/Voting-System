export default interface IApplicationItem {
  id: number;
  voteTime: string;
  createTime: string;
  status: string;
  recordState: string;
  comment: string;
  applicationId: number;
  toDepartmentId: number;
  toUserId: number;
}
