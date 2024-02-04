import styles from './index.module.scss';

export default function PageTitle({ children }: React.PropsWithChildren) {
  return <h2 className={styles.pageTitle}>{children}</h2>;
}
