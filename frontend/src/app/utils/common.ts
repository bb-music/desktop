import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

/** 合并 className */
export function cls(...classList: Array<string | undefined | boolean>) {
  return classList.filter((i) => !!i).join(' ');
}

/** 秒转 mm:ss */
export function seconds2mmss(duration: number) {
  return dayjs.duration(duration, 'seconds').format('mm:ss');
}
