export interface ListResult<T> {
  current: number;
  total: number;
  pageSize: number;
  list: T[];
}
