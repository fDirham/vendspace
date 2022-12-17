import React from 'react';
import styles from './ItemBlock.module.scss';
import { ItemInfo } from 'utilities/types';

type ItemBlockProps = {
  item?: ItemInfo;
  add?: boolean;
  onClick: () => void;
};

export default function ItemBlock({ item, onClick, add }: ItemBlockProps) {
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
      className={`${styles.container} ${add ? styles.addContainer : ''}`}
      onClick={onClick}
    >
      {renderVisual()}
    </div>
  );
}
