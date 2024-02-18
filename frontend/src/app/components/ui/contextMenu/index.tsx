import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './index.module.scss';
import { useGlobalStore } from '@/app/store/global';
import { cls } from '@/app/utils';
interface MenuItemLabel {
  label: string;
  key: string;
  arrow?: boolean;
  type?: 'label';
  onClick?: () => void | Promise<void>;
  disabled?: boolean;
  hide?: boolean;
}
interface MenuItemDivider {
  key: string;
  type: 'divider';
  hide?: boolean;
}

type MenuItem = MenuItemLabel | MenuItemDivider;

interface Position {
  x: number;
  y: number;
}

interface MenuProps {
  items: MenuItem[];
  open?: boolean;
  position?: Position;
  onClose?: () => void;
}

interface DomPos {
  left?: number;
  right?: number;
  bottom?: number;
  top?: number;
}

export interface ContextMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  tag?: string;
  className?: string;
  style?: React.CSSProperties;
  items: MenuItem[];
}

type ShowContextMenuFn = (pos: Position, items: MenuItem[]) => void;

export let showContextMenu: ShowContextMenuFn;

export function ContextMenu({
  tag = 'div',
  children,
  items = [],
  ...props
}: React.PropsWithChildren<ContextMenuProps>) {
  const CustomTag = `${tag}` as keyof JSX.IntrinsicElements;
  const [menu, setMenu] = useState({
    open: false,
    position: { x: 0, y: 0 },
  });
  useEffect(() => {
    const handler = () => {
      if (menu.open) {
        setMenu({
          open: false,
          position: { x: 0, y: 0 },
        });
      }
    };
    document.addEventListener('contextmenu', handler);
    document.addEventListener('click', handler);
    return () => {
      document.removeEventListener('click', handler);
      document.addEventListener('contextmenu', handler);
    };
  }, []);
  return (
    <CustomTag
      {...(props as any)}
      onContextMenu={(e) => {
        e.preventDefault();
        const x = e.clientX;
        const y = e.clientY;
        showContextMenu({ x, y }, items);
      }}
    >
      {children}
    </CustomTag>
  );
}

function Menu({ open, position = { x: 0, y: 0 }, items, onClose }: MenuProps) {
  const [pos, setPos] = useState<DomPos>();
  const targetRef = useRef<HTMLUListElement>(null);
  const global = useGlobalStore();
  useLayoutEffect(() => {
    const target = targetRef.current;
    if (target) {
      const { innerWidth: w, innerHeight: h } = window;
      const box = target.getBoundingClientRect();
      let left = position.x;
      let top = position.y;

      if (box.top + box.height >= h) {
        top = h - box.height;
      }
      if (box.left + box.width >= w) {
        left = w - box.width;
      }

      setPos({
        left,
        top,
      });
    }
  }, [position]);

  if (!open) return null;
  return (
    <ul
      ref={targetRef}
      className={cls(styles.menu, global.theme)}
      style={pos}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {items.map((item, index) => {
        if (item.hide) return null;
        if (item.type === 'divider') {
          return (
            <div
              key={index}
              className={styles.divider}
            ></div>
          );
        }
        return (
          <li
            className={cls(styles.item, item.disabled && styles.disabled)}
            key={item.key}
            onClick={async () => {
              if (item.disabled) return;
              try {
                await item.onClick?.();
                onClose?.();
              } catch (e) {}
            }}
          >
            <div className={styles.left}>
              <span className={styles.label}>{item.label}</span>
            </div>
            {item.arrow && <span className={styles.arrow}></span>}
          </li>
        );
      })}
    </ul>
  );
}

export function ContextMenuRoot() {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<Position>({ x: 0, y: 0 });
  const [items, setItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    showContextMenu = (pos, items) => {
      setItems(items);
      setPos(pos);
      setOpen(!!items?.length);
    };
    const handler = () => {
      setOpen(false);
    };
    document.addEventListener('click', handler);
    return () => {
      document.removeEventListener('click', handler);
    };
  }, []);

  return (
    <Menu
      position={pos}
      open={open}
      items={items}
      onClose={() => {
        setOpen(false);
      }}
    />
  );
}
