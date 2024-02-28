import React, { ChangeEventHandler } from 'react';
import { cls } from '../../../utils';
import styles from './index.module.scss';
import { UIPrefix } from '../../../consts';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  type?: 'text';
  value?: string;
  disabled?: boolean;
  readOnly?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

export function Input({ className, style, type, ...props }: InputProps) {
  return (
    <input
      {...props}
      className={cls(styles.input, `${UIPrefix}-input`, className)}
      style={style}
      type={type}
    />
  );
}
