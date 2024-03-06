import React from 'react';
import { cls } from '../../../utils';
import styles from './index.module.scss';
import { UIPrefix } from '../../../consts';

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {}

export function Table({ className, style, ...props }: TableProps) {
  return <table {...props} className={cls(styles.table, `${UIPrefix}-table`, className)}></table>;
}
