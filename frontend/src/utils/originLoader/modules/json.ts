import { isJson } from '@/utils';
import { MusicOrderOriginLoader } from '../common';
import { MusicOrderItem } from '@/interface';
import { configStore } from '@/store/config';
import { GetJsonOrigin } from '@wails/go/app/App';

interface ListFileItem {
  type: string;
  size?: any;
  name: string;
  path: string;
  sha: string;
  url: string;
  html_url: string;
  download_url: string;
}

interface FileInfo {
  type: string;
  encoding: string;
  size: number;
  name: string;
  path: string;
  content: string;
  sha: string;
  url: string;
  html_url: string;
  download_url: string;
}

export class JsonOriginLoader implements MusicOrderOriginLoader {
  constructor(private origin: string) {}

  async getList() {
    return GetJsonOrigin(this.origin);
  }
}
