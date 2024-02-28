import styles from './index.module.scss';
import * as RadixSwitch from '@radix-ui/react-switch';
import { cls } from '../../../utils';

interface SwitchProps extends Omit<RadixSwitch.SwitchProps, 'onChange'> {
  onChange?: (value: boolean) => void;
}

export function Switch({ onChange, ...props }: React.PropsWithChildren<SwitchProps>) {
  return (
    <RadixSwitch.Root
      {...props}
      onCheckedChange={(e) => {
        onChange?.(e);
        props.onCheckedChange?.(e);
      }}
      className={cls(styles.SwitchRoot, props.className)}
    >
      <RadixSwitch.Thumb className={styles.SwitchThumb} />
    </RadixSwitch.Root>
  );
}
