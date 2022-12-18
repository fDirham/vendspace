import React from 'react';
import styles from './ModalContactInfo.module.scss';
import ModalBase from 'components/all/ModalBase';
import { ModalBaseProps } from 'components/all/ModalBase/ModalBase';
import { StoreInfo } from 'utilities/types';

type ModalContactInfoProps = {
  open: boolean;
  onClose: () => void;
  storeInfo: StoreInfo;
};

export default function ModalContactInfo(props: ModalContactInfoProps) {
  const renderContent = (modalProps: ModalBaseProps) => {
    return (
      <>
        <p className={styles.sectionTitle}>Contact info</p>
        <p className={styles.sectionText}>{props.storeInfo.contact}</p>
        <p className={styles.sectionTitle}>Payment info</p>
        <p className={styles.sectionText}>{props.storeInfo.payment}</p>
      </>
    );
  };

  return (
    <ModalBase
      open={props.open}
      onClose={props.onClose}
      renderContent={renderContent}
      containerClassName={styles.container}
      canClose
    />
  );
}
