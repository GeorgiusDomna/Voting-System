export interface IDepartmentData {
  id: number;
  name: string;
  amountOfEmployee: number;
}

export interface IDepartmentInfo {
  empty: boolean;
  first: boolean;
  last: boolean;
  number: number;
  numberOfElements: number;
  pageable: {
    offset: number;
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    unpaged: boolean;
  };
  size: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  totalElements: number;
  totalPages: number;
}

export interface IDepartmentResponse {
  pageData: IDepartmentData[];
  pageInfo: IDepartmentInfo;
}
