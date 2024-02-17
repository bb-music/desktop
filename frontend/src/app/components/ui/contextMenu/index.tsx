import React, { createRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './index.module.scss';

export interface ContextMenuProps {
  tag?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function ContextMenu({
  tag = 'div',
  children,
  ...props
}: React.PropsWithChildren<ContextMenuProps>) {
  const CustomTag = `${tag}` as keyof JSX.IntrinsicElements;
  const [menu, setMenu] = useState({
    open: false,
    position: { x: 0, y: 0 },
  });
  useEffect(() => {
    const handler = () => {
      setMenu({
        open: false,
        position: { x: 0, y: 0 },
      });
    };
    document.addEventListener('click', handler);
    return () => {
      document.removeEventListener('click', handler);
    };
  }, []);
  return (
    <>
      <CustomTag
        {...props}
        onContextMenu={(e) => {
          console.dir(e);
          const x = e.clientX;
          const y = e.clientY;
          console.log(x, y);
          e.preventDefault();
          setMenu({
            open: true,
            position: { x, y },
          });
        }}
      >
        {children}
      </CustomTag>
      <Menu
        {...menu}
        items={Array.from({ length: 10 }).map((_, ind) => {
          return {
            label: `菜单${ind}`,
            key: ind + '',
          };
        })}
      />
    </>
  );
}

interface MenuItem {
  label?: string;
  key: string;
  type?: 'divider';
  onClick?: () => void;
}

interface MenuProps {
  items: MenuItem[];
  open?: boolean;
  position?: { x: number; y: number };
}

interface DomPos {
  left?: number;
  right?: number;
  bottom?: number;
  top?: number;
}
export function Menu({ open, position = { x: 0, y: 0 }, items }: MenuProps) {
  const [pos, setPos] = useState<DomPos>();
  const targetRef = useRef<HTMLUListElement>(null);
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
      className={styles.menu}
      style={pos}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      {items.map((item, index) => {
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
            className={styles.item}
            key={item.key}
          >
            <div className={styles.left}>
              <span className={styles.label}>{item.label}</span>
            </div>
            <span className={styles.arrow}></span>
          </li>
        );
      })}
    </ul>
  );
}
