import * as RadixSlider from '@radix-ui/react-slider';
import styles from './index.module.scss';
import { cls } from '../../../utils';

interface SliderProps extends RadixSlider.SliderProps {}

export const Slider = ({ ...props }: SliderProps) => (
  <RadixSlider.Root {...props} className={cls(styles.SliderRoot, props.className)}>
    <RadixSlider.Track className={styles.SliderTrack}>
      <RadixSlider.Range className={styles.SliderRange} />
    </RadixSlider.Track>
    <RadixSlider.Thumb className={styles.SliderThumb} aria-label="Volume" />
  </RadixSlider.Root>
);
