import axios from 'axios';

export const request = axios.create({
  baseURL: 'http://localhost:9091',
});

export interface Resp<T = any> {
  code: number;
  message: string;
  data: T;
}
