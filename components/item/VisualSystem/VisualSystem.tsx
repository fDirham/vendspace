import React, { useState } from 'react';
import styles from './VisualSystem.module.scss';
import { ItemVisual } from 'utilities/types';
import Head from 'next/head';
import VisualCover from '../VisualCover';
import VisualBlock from '../VisualBlock';
type VisualSystemProps = {
  visuals: ItemVisual[];
};

export default function VisualSystem(props: VisualSystemProps) {
  const [coverIndex, setCoverIndex] = useState<number>(0);
  const coverVisual = props.visuals[coverIndex]!;

  const renderBlocks = () => {
    return props.visuals.map((visual, index) => {
      return (
        <VisualBlock
          visual={visual}
          selected={coverIndex == index}
          onClick={() => setCoverIndex(index)}
          key={visual.uri}
        />
      );
    });
  };

  return (
    <div className={styles.container}>
      <VisualCover visual={coverVisual} />
      <div className={styles.blocksContainer}>{renderBlocks()}</div>
    </div>
  );
}
