import React from 'react';
import styles from './VisualCover.module.scss';
import { ItemVisual } from 'utilities/types';

type VisualCoverProps = {
  visual: ItemVisual;
};

export default function VisualCover(props: VisualCoverProps) {
  return (
    <div className={styles.container}>
      <img src={props.visual.uri} alt='cover' className={styles.image} />
    </div>
  );
}
