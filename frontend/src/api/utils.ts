import { Utils } from '@/app/api/utils';
import { transformImgUrl } from '@/utils';

export class UtilsInstance implements Utils {
  imgUrlTransform(url: string): string {
    return transformImgUrl(url);
  }
}
