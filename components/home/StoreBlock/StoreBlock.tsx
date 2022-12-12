import React from 'react';
import { StoreInfo } from 'utilities/types';
import styles from './StoreBlock.module.scss';

type StoreBlockProps = {
  storeInfo: StoreInfo;
  onNavigate: () => void;
  onEdit: () => void;
};

export default function StoreBlock({
  storeInfo,
  onNavigate,
  onEdit,
}: StoreBlockProps) {
  return (
    <div className={styles.container}>
      <div className={styles.leftContainer} onClick={onNavigate}>
        <p>{storeInfo.name}</p>
      </div>
      <div className={styles.rightContainer} onClick={onEdit}>
        <img src='/icons/edit.png' alt='edit' className={styles.editIcon} />
      </div>
    </div>
  );
}
