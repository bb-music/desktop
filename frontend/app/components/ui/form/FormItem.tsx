import { cls } from '../../../utils';
import styles from './index.module.scss';

interface FormItemProps {
  className?: string;
  style?: React.CSSProperties;
  label?: string;
}

export function FormItem({
  label,
  children,
  className,
  style,
}: React.PropsWithChildren<FormItemProps>) {
  return (
    <label className={cls(className, styles.formItem)} style={style}>
      <div className="ui-form-item-label">{label}</div>
      <div className="ui-form-item-content">{children}</div>
    </label>
  );
}
