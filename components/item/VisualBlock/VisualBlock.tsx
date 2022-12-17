import React from 'react';
import styles from './VisualBlock.module.scss';
import { ItemVisual } from 'utilities/types';

type VisualBlockProps = {
  visual: ItemVisual;
  selected: boolean;
  onClick: () => void;
};

export default function VisualBlock(props: VisualBlockProps) {
  return (
    <div
      className={`${styles.container} ${props.selected ? styles.selected : ''}`}
      onClick={props.onClick}
    >
      <img src={props.visual.uri} alt='' className={styles.image} />
    </div>
  );
}
