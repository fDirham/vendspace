import React from 'react';
import styles from './ModalContactInfo.module.scss';
import ModalBase from 'components/all/ModalBase';
import { ModalBaseProps } from 'components/all/ModalBase/ModalBase';
import { StoreInfo } from 'utilities/types';
import ReactLinkify from 'react-linkify';

type ModalContactInfoProps = {
  open: boolean;
  onClose: () => void;
  storeInfo: StoreInfo;
  showDesc?: boolean;
};

export default function ModalContactInfo(props: ModalContactInfoProps) {
  const renderContent = (modalProps: ModalBaseProps) => {
    return (
      <>
        <ReactLinkify>
          <p className={styles.sectionTitle}>Contact info</p>
          <p className={styles.sectionText}>{props.storeInfo.contact}</p>
          <p className={styles.sectionTitle}>Payment info</p>
          <p className={styles.sectionText}>{props.storeInfo.payment}</p>
          {props.showDesc && (
            <>
              <p className={styles.sectionTitle}>Store Description</p>
              <p className={styles.sectionText}>
                {props.storeInfo.description}
              </p>
            </>
          )}
        </ReactLinkify>
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
