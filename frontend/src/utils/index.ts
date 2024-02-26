export * from './proxy';

/** 合并 className */
export function cls(...classList: Array<string | undefined | boolean>) {
  return classList.filter((i) => !!i).join(' ');
}

export function transformImgUrl(url: string) {
  let r = url;
  if (!r.startsWith('https://') && !r.startsWith('http://')) {
    r = 'http:' + r;
  }
  return `https://image.baidu.com/search/down?url=${r}`;
}

export function string2Number(val: string | number) {
  const r = Number(val);
  if (isNaN(r)) return;
  return r;
}

export function isJson<T = Array<any> | Record<string, any>>(val: string): T | undefined {
  try {
    return JSON.parse(val);
  } catch (e) {
    return;
  }
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

export function createMusicId(music: {
  aid: string | number;
  bvid: string | number;
  cid: string | number;
}) {
  return [music.aid, music.bvid, music.cid].join('_');
}
