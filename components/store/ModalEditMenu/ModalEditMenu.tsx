import React from 'react';
import styles from './ModalEditMenu.module.scss';
import ModalBase, { ModalBaseProps } from 'components/all/ModalBase/ModalBase';
import StyledButton from 'components/all/StyledButton';
import { ItemInfo } from 'utilities/types';

type ModalEditMenuProps = {
  onClose: () => void;
  item?: ItemInfo;
  onDelete: () => void;
  onEdit: () => void;
  onBump: () => void;
};

export default function ModalEditMenu(props: ModalEditMenuProps) {
  const renderContent = (modalProps: ModalBaseProps) => {
    if (!props.item) return null;
    return (
      <>
        <p className={styles.itemName}>{props.item.name}</p>
        <StyledButton className={styles.button} onClick={props.onEdit}>
          edit
        </StyledButton>
        <StyledButton className={styles.button} onClick={props.onBump}>
          bump
        </StyledButton>
        <StyledButton className={styles.button} onClick={props.onDelete}>
          delete
        </StyledButton>
      </>
    );
  };

  return (
    <ModalBase
      open={!!props.item}
      onClose={props.onClose}
      renderContent={renderContent}
      containerClassName={styles.container}
      canClose
    />
  );
}
