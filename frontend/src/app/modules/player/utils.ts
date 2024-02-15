import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export function seconds2mmss(duration: number) {
  return dayjs.duration(duration, 'seconds').format('mm:ss');
}
