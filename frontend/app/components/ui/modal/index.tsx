import { Close } from '@icon-park/react';
import styles from './index.module.scss';
import { createPortal } from 'react-dom';
import { cls } from '../../../utils';
import { useGlobalStore } from '../../../store/global';
import { Button } from '../button';

let isMobileEnv = false;

export function setMobileEnv(isMobile: boolean) {
  isMobileEnv = isMobile;
}

interface ModalProps {
  title?: React.ReactNode;
  footer?: React.ReactNode;
  width?: number | string;
  open?: boolean;
  onClose?: () => void;
  onOk?: () => Promise<unknown> | void;
}

export function Modal({
  title,
  width = 400,
  footer,
  open,
  children,
  onClose,
  onOk,
}: React.PropsWithChildren<ModalProps>) {
  const global = useGlobalStore();
  if (!open) return null;
  console.log('isMobileEnv: ', isMobileEnv);

  return createPortal(
    <div
      className={cls(
        styles.modalContainer,
        global.theme,
        isMobileEnv ? styles.modalContainerForMobile : '',
      )}
    >
      <div className={styles.modal} style={{ width }}>
        <div className={styles.header}>
          <div className={styles.title}>{title}</div>
          <div className={styles.close} onClick={onClose}>
            <Close />
          </div>
        </div>
        <div className={styles.body}>{children}</div>
        <div className={styles.footer}>
          {footer ? (
            footer
          ) : (
            <>
              <Button
                type="primary"
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
              </Button>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
