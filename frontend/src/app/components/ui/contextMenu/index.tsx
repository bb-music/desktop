import React, { useEffect, useRef, useState } from 'react';
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
  children?: MenuItemLabel[];
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

interface ContextMenuContext {
  show: (pos: Position, items: MenuItem[]) => void;
  close: () => void;
}
export let contextMenu: ContextMenuContext;

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
        contextMenu.show({ x, y }, items);
        console.log('contextMenu: ', contextMenu);
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
  const ctxRef = useRef<ContextMenuContext>();
  useEffect(() => {
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
        return (
          <MenuItemComp
            data={item}
            key={item.key}
            onClose={onClose}
            ctxRef={ctxRef}
          />
        );
      })}
      <ContextMenuRoot
        onReady={(e) => {
          ctxRef.current = e;
        }}
      />
    </ul>
  );
}

function MenuItemComp({
  data,
  onClose,
  ctxRef,
}: {
  data: MenuItem;
  onClose?: () => void;
  ctxRef: React.MutableRefObject<ContextMenuContext | undefined>;
}) {
  const targetRef = useRef<HTMLLIElement>(null);

  if (data.hide) return null;
  if (data.type === 'divider') {
    return (
      <div
        key={data.key}
        className={styles.divider}
      ></div>
    );
  }
  return (
    <li
      ref={targetRef}
      className={cls(styles.item, data.disabled && styles.disabled)}
      onClick={async () => {
        if (data.disabled) return;
        try {
          await data.onClick?.();
          onClose?.();
        } catch (e) {}
      }}
      onMouseEnter={(e) => {
        if (!data.children?.length) {
          return ctxRef.current?.close();
        }
        const box = targetRef.current?.getBoundingClientRect();
        if (box) {
          ctxRef.current?.show({ x: box.left + box.width + 6, y: box.top }, data.children);
        }
        // setChildMenu({
        //   open: true,
        //   pos: { x: e.clientX, y: e.clientY },
        // });
      }}
    >
      <div className={styles.left}>
        <span className={styles.label}>{data.label}</span>
      </div>
      {data.arrow && <span className={styles.arrow}></span>}
    </li>
  );
}

export function ContextMenuRoot({ onReady }: { onReady?: (e: ContextMenuContext) => void }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<Position>({ x: 0, y: 0 });
  const [items, setItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    const ctx: ContextMenuContext = {
      show: (pos, items) => {
        setItems(items);
        setPos(pos);
        setOpen(!!items?.length);
      },
      close: () => {
        setOpen(false);
      },
    };

    if (typeof onReady === 'function') {
      onReady(ctx);
    } else {
      contextMenu = ctx;
    }
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
