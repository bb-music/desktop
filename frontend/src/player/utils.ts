import { string2Number } from '@/utils';
import { MusicItem } from '.';
import qs from 'querystring';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export function musicItem2Url(music: MusicItem) {
  const q = new URLSearchParams();
  q.set('aid', music.aid?.toString()!);
  q.set('bvid', music.bvid?.toString()!);
  q.set('cid', music.cid?.toString()!);
  return `http://localhost:7840/videofile/${music.name}.mp4?${q.toString()}`;
}

export function partItem2MusicItem(part: {
  aid: number | string;
  bvid: string;
  cid: number;
  part: string;
  duration: number;
}): MusicItem {
  const obj = {
    aid: string2Number(part.aid),
    bvid: part.bvid,
    cid: string2Number(part.cid)!,
    name: part.part,
    duration: part.duration,
  };
  return {
    ...obj,
    id: createMusicId({
      aid: obj.aid,
      bvid: obj.bvid,
      cid: obj.cid,
    }),
  };
}
export function createMusicId(music: Pick<MusicItem, 'aid' | 'bvid' | 'cid'>) {
  return [music.aid, music.bvid, music.cid].join('_');
}

export function createAudio(id: string) {
  if (typeof document !== 'undefined') {
    const a = document.getElementById(id);
    if (a) {
      return a as HTMLAudioElement;
    }
    const audio = new Audio();
    audio.style.display = 'none';
    audio.id = id;
    return audio;
  }
}

export function seconds2mmss(duration: number) {
  return dayjs.duration(duration, 'seconds').format('mm:ss');
}
