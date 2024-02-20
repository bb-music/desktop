import React from 'react';
import { cls } from '@/app/utils';
import styles from './index.module.scss';
import { UIPrefix } from '@/app/consts';

export interface ButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  type?: 'primary' | 'default' | 'link' | 'danger' | 'text';
}

export function Button({ type = 'default', className, style, children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={cls(styles.btn, `${UIPrefix}-btn`, className, styles[type])}
      style={style}
    >
      {children}
    </button>
  );
}
