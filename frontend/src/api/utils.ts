import { UtilsApi } from '@bb-music/app';
import { transformImgUrl } from '@/utils';

export class UtilsInstance implements UtilsApi {
  imgUrlTransform: UtilsApi['imgUrlTransform'] = (url: string) => {
    return transformImgUrl(url);
  };
}
