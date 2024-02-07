/** 适用与大屏设备的 APP 容器 */

import { cls } from '@/app/utils';
import styles from './index.module.scss';
import { UIPrefix } from '@/app/consts';
import { BaseElementProps } from '@/app/interface';

export interface PcContainerProps extends BaseElementProps {}

export function PcContainer({ className, style }: PcContainerProps) {
  return (
    <div
      className={cls(styles.container, `${UIPrefix}-container`, className)}
      style={style}
    ></div>
  );
}
