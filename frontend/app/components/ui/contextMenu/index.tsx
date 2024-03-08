import React from 'react';
import { useGlobalStore } from '../../../store/global';
import { cls } from '../../../utils';
import * as RadixContextMenu from '@radix-ui/react-context-menu';
import styles from './index.module.scss';
import { useShallow } from 'zustand/react/shallow';

interface MenuItemLabel {
  label: string;
  key: string;
  arrow?: boolean;
  type?: 'label';
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
  hide?: boolean;
  children?: MenuItemLabel[];
}
interface MenuItemDivider {
  key: string;
  type: 'divider';
  hide?: boolean;
}

type MenuItem = MenuItemLabel | MenuItemDivider;

export interface ContextMenuProps extends React.ComponentProps<typeof RadixContextMenu.Trigger> {
  tag?: string;
  className?: string;
  style?: React.CSSProperties;
  items: MenuItem[];
}

export function ContextMenu({
  tag = 'div',
  children,
  items = [],
  ...props
}: React.PropsWithChildren<ContextMenuProps>) {
  const global = useGlobalStore(
    useShallow((s) => ({
      theme: s.theme,
    })),
  );
  return (
    <RadixContextMenu.Root>
      <RadixContextMenu.Trigger {...props} style={{ ...props.style, zIndex: 9999 }}>
        {children}
      </RadixContextMenu.Trigger>
      <RadixContextMenu.Portal>
        <RadixContextMenu.Content
          className={cls(styles.menu, global.theme)}
          style={{ zIndex: 9999 }}
        >
          {items.map((item) => {
            return <MenuItem item={item} key={item.key} />;
          })}
        </RadixContextMenu.Content>
      </RadixContextMenu.Portal>
    </RadixContextMenu.Root>
  );
}

export function MenuItem({ item }: { item: MenuItem }) {
  const global = useGlobalStore(
    useShallow((s) => ({
      theme: s.theme,
    })),
  );
  if (item.hide) return null;
  if (item.type === 'divider') {
    return <RadixContextMenu.Separator key={item.key} className={styles.divider} />;
  }
  if (item.children?.length) {
    return (
      <RadixContextMenu.Sub>
        <RadixContextMenu.SubTrigger className={styles.item}>
          {item.label}
        </RadixContextMenu.SubTrigger>
        <RadixContextMenu.Portal>
          <RadixContextMenu.SubContent
            className={cls(global.theme, styles.menu)}
            sideOffset={2}
            alignOffset={-5}
          >
            {item.children.map((c) => {
              return <MenuItem item={c} key={c.key} />;
            })}
          </RadixContextMenu.SubContent>
        </RadixContextMenu.Portal>
      </RadixContextMenu.Sub>
    );
  }
  return (
    <RadixContextMenu.Item className={styles.item} key={item.key} onClick={item.onClick}>
      {item.label}
    </RadixContextMenu.Item>
  );
}
