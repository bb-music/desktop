import { ReactNode } from 'react';
import * as RadixDialog from '@radix-ui/react-dialog';
import { useShallow } from 'zustand/react/shallow';
import styles from './index.module.scss';
import { useGlobalStore } from '../../../store/global';
import { cls } from '../../../utils';
import { createRoot } from 'react-dom/client';

interface ActionItem {
  label: ReactNode;
  key: string | number;
  desc?: ReactNode;
  disabled?: boolean;
  onClick?: (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => Promise<boolean | undefined> | void;
}

export interface ActionSheetProps {
  open?: boolean;
  title?: ReactNode;
  items: ActionItem[];
  cancelText?: ReactNode;
  onCancel?: () => void;
  onOpenChange?: (open: boolean) => void;
}

export function ActionSheet({
  title,
  open,
  items,
  cancelText,
  onCancel,
  onOpenChange,
}: ActionSheetProps) {
  const theme = useGlobalStore(useShallow((s) => s.theme));
  const closeHandler = () => {
    onOpenChange?.(false);
  };
  return (
    <RadixDialog.Root open={open}>
      <RadixDialog.Trigger asChild></RadixDialog.Trigger>
      <RadixDialog.Portal>
        <RadixDialog.Overlay className={cls(theme, styles.DialogOverlay)} onClick={closeHandler} />
        <RadixDialog.Content className={cls(theme, styles.DialogContent)}>
          <div>
            {title && <RadixDialog.Title className={styles.DialogTitle}>{title}</RadixDialog.Title>}
            {items.map((item) => {
              return (
                <div
                  key={item.key}
                  className={styles.ActionItem}
                  aria-disabled={!!item.disabled}
                  onClick={async (e) => {
                    if (item.disabled) return;
                    const o = await item.onClick?.(e);
                    if (!o) {
                      closeHandler();
                    }
                  }}
                >
                  <div>{item.label}</div>
                </div>
              );
            })}
          </div>
          {cancelText && (
            <div
              className={styles.CancelItem}
              onClick={() => {
                onCancel?.();
                closeHandler();
              }}
            >
              <div className={styles.ActionItem}>{cancelText}</div>
            </div>
          )}
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
}

export function showActionSheet({ ...props }: Omit<ActionSheetProps, 'open' | 'onOpenChange'>) {
  const con = document.createElement('div');
  document.body.appendChild(con);

  const root = createRoot(con);

  const close = () => {
    root.unmount();
  };

  root.render(
    <ActionSheet
      {...props}
      open
      onOpenChange={(e) => {
        if (!e) {
          close();
        }
      }}
      onCancel={() => {
        props.onCancel?.();
        close();
      }}
    />,
  );

  return close;
}
