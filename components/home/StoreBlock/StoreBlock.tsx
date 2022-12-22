import React from 'react';
import { StoreInfo } from 'utilities/types';
import styles from './StoreBlock.module.scss';

type StoreBlockProps = {
  storeInfo?: StoreInfo;
  onNavigate: () => void;
  onEdit?: () => void;
  add?: boolean;
  isUser?: boolean;
};

export default function StoreBlock({
  storeInfo,
  onNavigate,
  onEdit,
  add,
  isUser,
}: StoreBlockProps) {
  const renderRightIcon = () => {
    if (!isUser) {
      return null;
    }
    if (add) {
      return (
        <div className={styles.rightContainer} onClick={onNavigate}>
          <img src='/icons/add.png' alt='add' className={styles.editIcon} />
        </div>
      );
    }
    return (
      <div className={styles.rightContainer} onClick={onEdit}>
        <img src='/icons/edit.png' alt='edit' className={styles.editIcon} />
      </div>
    );
  };
  return (
    <div className={styles.container}>
      <div className={styles.leftContainer} onClick={onNavigate}>
        {!!storeInfo && <p>{storeInfo.name}</p>}
        {add && <p className={styles.newText}>new store...</p>}
      </div>
      {renderRightIcon()}
    </div>
  );
}
