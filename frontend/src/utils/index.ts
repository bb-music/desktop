import { GetConfig } from '@wails/go/app_bili/App';

export * from './proxy';
export { cls, isJson } from '@bb-music/app/utils';

// function initPort() {
//   GetConfig().then((res) => {
//     if (res?.proxyServerPort) {
//       proxyProt = res?.proxyServerPort;
//     }
//   });
// }
let proxyProt = process.env.NODE_ENV === 'production' ? 56592 : 56599;
export function transformImgUrl(url: string) {
  let r = url;
  if (!r.startsWith('https://') && !r.startsWith('http://')) {
    r = 'http:' + r;
  }
  return `http://localhost:${proxyProt}/image/proxy?url=${r}`;
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
