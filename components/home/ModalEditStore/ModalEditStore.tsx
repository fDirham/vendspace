import React from 'react';
import styles from './ModalEditStore.module.scss';
import ModalBase, { ModalBaseProps } from 'components/all/ModalBase/ModalBase';
import StyledButton from 'components/all/StyledButton';
import { StoreInfo } from 'utilities/types';

type ModalEditStoreProps = {
  onClose: () => void;
  storeInfo?: StoreInfo;
  onDelete: () => void;
  onEdit: () => void;
};

export default function ModalEditStore(props: ModalEditStoreProps) {
  const renderContent = (modalProps: ModalBaseProps) => {
    if (!props.storeInfo) return null;
    return (
      <>
        <p className={styles.editText}>edit</p>
        <p className={styles.storeName}>{props.storeInfo.name}</p>
        <div className={styles.buttonContainer}>
          <StyledButton className={styles.button} onClick={props.onEdit}>
            edit info
          </StyledButton>
          <StyledButton className={styles.button} onClick={props.onDelete}>
            delete
          </StyledButton>
        </div>
      </>
    );
  };

  return (
    <ModalBase
      open={!!props.storeInfo}
      onClose={props.onClose}
      renderContent={renderContent}
      containerClassName={styles.container}
      canClose
    />
  );
}
