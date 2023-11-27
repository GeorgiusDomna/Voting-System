export default interface getAllUsersDepartmentsParams {
  page?: number;
  limit?: number;
  recordState: 'ACTIVE' | 'DELETE';
  departmentId: number;
}
