import React from 'react';
import styles from './ItemBlock.module.scss';
import { ItemInfo } from 'utilities/types';

type ItemBlockProps = {
  item?: ItemInfo;
  add?: boolean;
  editing?: boolean;
  onClick: () => void;
};

export default function ItemBlock({
  item,
  onClick,
  add,
  editing,
}: ItemBlockProps) {
  const renderVisual = () => {
    if (item && item.visuals.length) {
      return (
        <img
          src={item.visuals[0].uri}
          alt={item.name}
          className={styles.coverVisual}
        />
      );
    } else if (add) {
      return (
        <img src='/icons/add.png' alt='add' className={styles.addVisual} />
      );
    } else {
      return (
        <div className={styles.placeholderTextContainer}>
          <p className={styles.placeholderText}>{item!.name}</p>
        </div>
      );
    }
  };

  return (
    <div
      className={`${styles.container} ${add ? styles.addContainer : ''} ${
        editing ? styles.editingContainer : ''
      }`}
      onClick={onClick}
    >
      {(item?.hold || item?.sold) && (
        <div className={styles.statusOverlay}>
          <p className={styles.statusText}>
            {item.sold ? 'SOLD OUT' : 'ON HOLD'}
          </p>
        </div>
      )}
      {editing && (
        <img className={styles.editIcon} src='/icons/edit.png' alt='edit' />
      )}
      {renderVisual()}
    </div>
  );
}
