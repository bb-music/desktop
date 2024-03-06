import React from 'react';
import { cls } from '../../../utils';
import styles from './index.module.scss';
import { UIPrefix } from '../../../consts';

export interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'type'> {
  mode?: React.CSSProperties['objectFit'];
}

export function Image({ className, style, mode, src, alt, ...props }: ImageProps) {
  return (
    <div className={cls(styles.img, `${UIPrefix}-img`, className)} style={style} {...props}>
      <img style={{ objectFit: mode }} src={src} alt={alt} />
    </div>
  );
}
