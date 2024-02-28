export abstract class UtilsApi {
  /** 图片地址转换，用于某些某些图片被防盗链 */
  abstract imgUrlTransform(url: string): string;
}
