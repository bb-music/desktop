import React, { ChangeEventHandler } from 'react';
import { BaseElementProps } from '@/app/interface';
import { cls } from '@/app/utils';
import styles from './index.module.scss';
import { UIPrefix } from '@/app/consts';

export interface InputProps extends React.PropsWithChildren<BaseElementProps> {
  type?: 'text';
  value?: string;
  disabled?: boolean;
  readOnly?: boolean;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}

export function Input({ className, style, type, value, disabled, readOnly, onChange }: InputProps) {
  return (
    <input
      className={cls(styles.input, `${UIPrefix}-input`, className)}
      style={style}
      type={type}
      value={value}
      onChange={(e) => {
        onChange?.(e);
      }}
      disabled={disabled}
      readOnly={readOnly}
    />
  );
}
