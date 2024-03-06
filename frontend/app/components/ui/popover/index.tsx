import React, { PropsWithChildren, cloneElement, useEffect } from 'react';
import * as RadixPopover from '@radix-ui/react-popover';
import styles from './index.module.scss';
import { cls } from '../../../utils';
import { useGlobalStore } from '../../../store/global';
import { useShallow } from 'zustand/react/shallow';

interface PopoverProps extends RadixPopover.PopoverProps {
  content?: React.ReactNode;
  asChild?: boolean;
  children?: React.ReactElement;
  contentProps?: RadixPopover.PopoverContentProps & React.HTMLAttributes<HTMLDivElement>;
  arrowColor?: string;
}

export const Popover = ({
  children,
  content,
  asChild,
  contentProps,
  arrowColor,
  ...props
}: PopoverProps) => {
  const { theme } = useGlobalStore(useShallow((s) => ({ theme: s.theme })));
  return (
    <RadixPopover.Root {...props}>
      <RadixPopover.Trigger asChild={asChild}>{children}</RadixPopover.Trigger>
      <RadixPopover.Portal>
        <RadixPopover.Content
          {...contentProps}
          sideOffset={5}
          className={cls(theme, styles.PopoverContent, contentProps?.className)}
        >
          <>{content}</>
          <RadixPopover.Arrow className={styles.Arrow} style={{ fill: arrowColor }} />
        </RadixPopover.Content>
      </RadixPopover.Portal>
    </RadixPopover.Root>
  );
};
