import React from 'react';
import { BaseElementProps } from '@/app/interface';
import { cls } from '@/app/utils';
import styles from './index.module.scss';
import { UIPrefix } from '@/app/consts';

export interface ButtonProps extends React.PropsWithChildren<BaseElementProps> {
  type?: 'primary' | 'default' | 'dashed' | 'danger';
}

export function Button({ className, style, children }: ButtonProps) {
  return (
    <button
      className={cls(styles.btn, `${UIPrefix}-btn`, className)}
      style={style}
    >
      {children}
    </button>
  );
}
