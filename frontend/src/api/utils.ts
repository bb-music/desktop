import { Utils } from 'bb-music-ui/app/api';
import { transformImgUrl } from '@/utils';

export class UtilsInstance implements Utils {
  imgUrlTransform(url: string): string {
    return transformImgUrl(url);
  }
}
