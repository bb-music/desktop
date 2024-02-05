import { Close } from '@icon-park/react';
import styles from './index.module.scss';
import { createPortal } from 'react-dom';

interface ModalProps {
  title?: React.ReactNode;
  footer?: React.ReactNode;
  width?: number | string;
  open?: boolean;
  onClose?: () => void;
  onOk?: () => Promise<unknown>;
}

export function Modal({
  title,
  width = 300,
  footer,
  open,
  children,
  onClose,
  onOk,
}: React.PropsWithChildren<ModalProps>) {
  if (!open) return null;
  return createPortal(
    <div className={styles.modalContainer}>
      <div
        className={styles.modal}
        style={{ width }}
      >
        <div className={styles.header}>
          <div className={styles.title}>{title}</div>
          <div
            className={styles.close}
            onClick={onClose}
          >
            <Close />
          </div>
        </div>
        <div className={styles.body}>{children}</div>
        <div className={styles.footer}>
          {footer ? (
            footer
          ) : (
            <>
              <button
                className='cancel'
                onClick={onClose}
              >
                取消
              </button>
              <button
                onClick={async () => {
                  try {
                    await onOk?.();
                    onClose?.();
                  } catch (error) {
                    console.error(error);
                  }
                }}
              >
                确定
              </button>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}
