import React from 'react';
import { StoreInfo } from 'utilities/types';
import styles from './StoreBlock.module.scss';

type StoreBlockProps = { storeInfo: StoreInfo; onClick: () => void };

export default function StoreBlock({ storeInfo, onClick }: StoreBlockProps) {
  return (
    <div className={styles.container} onClick={onClick}>
      <p>{storeInfo.name}</p>
    </div>
  );
}
