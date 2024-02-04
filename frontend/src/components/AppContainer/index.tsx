import { cls } from '@/utils';
import styles from './index.module.scss';

export function AppContainer({
  className,
  style,
  children,
}: React.PropsWithChildren<{ className?: string; style?: React.CSSProperties }>) {
  return (
    <div
      className={cls(styles.appContainer, className)}
      style={style}
    >
      {children}
    </div>
  );
}
