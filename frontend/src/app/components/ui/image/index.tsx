import React from 'react';
import { cls } from '@/app/utils';
import styles from './index.module.scss';
import { UIPrefix } from '@/app/consts';

export interface ImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'type'> {
  mode?: 'cover';
}

export function Image({ className, style, mode, src, ...props }: ImageProps) {
  if (mode) {
    return (
      <div
        {...props}
        className={cls(styles.img, `${UIPrefix}-img`, styles[mode], className)}
        style={{ ...style, backgroundImage: `url(${src})` }}
      />
    );
  }
  return (
    <img
      {...props}
      src={src}
      className={cls(styles.img, `${UIPrefix}-img`, className)}
      style={style}
    />
  );
}
