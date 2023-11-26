export default interface GetUserParams {
    roleName?: string;
    departmentName?: string;
    firstName?: string;
    lastName?: string;
    patronymic?: string;
    birthDateFrom?: string;
    birthDateTo?: string;
    email?: string;
    limit?: number;
    page?: number;
  }