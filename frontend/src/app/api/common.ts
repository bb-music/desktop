export interface ListResult<T> {
  current: number;
  total: number;
  pageSize: number;
  data: T[];
}
