export * from './proxy';
export { cls, isJson } from '../../app/utils';

export function transformImgUrl(url: string) {
  let r = url;
  if (!r.startsWith('https://') && !r.startsWith('http://')) {
    r = 'http:' + r;
  }
  return `https://image.baidu.com/search/down?url=${r}`;
}

/**
 * mm:ss 转为 秒
 */
export function mmss2seconds(str: string) {
  const [m, s] = str.split(':').map(Number);
  return m * 60 + s;
}

export function html2text(str: string) {
  const html = document.createElement('div');
  html.innerHTML = str;
  return html.innerText;
}
