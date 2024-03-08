import * as Toast from '@radix-ui/react-toast';
import { useEffect, useRef, useState } from 'react';
import styles from './index.module.scss';

export let message: MessageInstance;

export function MessageRoot() {
  const [items, setItems] = useState<MessageItemProps[]>([]);
  useEffect(() => {
    const open = (message: React.ReactNode, { duration }: Partial<MessageItemProps>) => {
      const id = Date.now().toString();
      setItems((prev) => [
        ...prev,
        {
          open: true,
          key: id,
          message,
          duration,
          onClose: () => {
            setItems((prev) => prev.filter((item) => item.key !== id));
          },
        },
      ]);
    };
    message = {
      success: (message) => {
        open(message, {});
      },
      loading: (message) => {
        open(message, { duration: 60 * 1000 * 10 });
      },
      error: (message) => {
        open(message, {});
      },
    };
  }, []);
  return (
    <Toast.Provider swipeDirection="up">
      {items.map((item) => {
        return <MessageItem {...item}></MessageItem>;
      })}
      <Toast.Viewport className={styles.ToastViewport} />
    </Toast.Provider>
  );
}
interface MessageItemProps {
  open?: boolean;
  key: string;
  message: React.ReactNode;
  duration?: number;
  onClose: () => void;
  type?: 'loading';
}
export function MessageItem({ open, message, onClose, duration = 3000 }: MessageItemProps) {
  const timerRef = useRef(0);

  return (
    <Toast.Root
      className={styles.ToastRoot}
      open={open}
      onOpenChange={(e) => {
        if (!e) {
          onClose();
        }
      }}
      duration={duration}
    >
      <Toast.Title>{message}</Toast.Title>
    </Toast.Root>
  );
}

interface MessageInstance {
  success: (message: React.ReactNode) => void;
  error: (message: React.ReactNode) => void;
  // info: (message: React.ReactNode) => void;
  // warning: (message: React.ReactNode) => void;
  loading: (message: React.ReactNode) => void;
}
