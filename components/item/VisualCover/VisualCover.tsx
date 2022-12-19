import React from 'react';
import styles from './VisualCover.module.scss';
import { ItemVisual } from 'utilities/types';

type VisualCoverProps = {
  visual: ItemVisual;
};

export default function VisualCover(props: VisualCoverProps) {
  const src = props.visual ? props.visual.uri : '/icons/no-image.png';

  return (
    <div className={styles.container}>
      <img src={src} alt='cover' className={styles.image} />
    </div>
  );
}
