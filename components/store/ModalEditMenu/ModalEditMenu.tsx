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
  onView: () => void;
  onBump: () => void;
  onSold: (sold: boolean) => void;
  onHold: (hold: boolean) => void;
};

export default function ModalEditMenu(props: ModalEditMenuProps) {
  function handleHold() {
    props.onHold(!props.item!.hold);
  }

  function handleSold() {
    props.onSold(!props.item!.sold);
  }
  const renderContent = (modalProps: ModalBaseProps) => {
    if (!props.item) return null;
    return (
      <>
        <p className={styles.editText}>edit</p>
        <p className={styles.itemName}>{props.item.name}</p>
        <div className={styles.buttonContainer}>
          <StyledButton className={styles.button} onClick={props.onEdit} mini>
            edit content
          </StyledButton>
          <StyledButton className={styles.button} onClick={props.onView} mini>
            view content
          </StyledButton>
          <StyledButton
            className={styles.buttonAlone}
            onClick={props.onBump}
            mini
          >
            bump
          </StyledButton>
          <StyledButton className={styles.button} onClick={handleHold} mini>
            {!props.item.hold ? 'set' : 'remove'} on hold
          </StyledButton>
          <StyledButton className={styles.button} onClick={handleSold} mini>
            {!props.item.sold ? 'set' : 'remove'} sold out
          </StyledButton>
          <StyledButton
            className={styles.buttonAlone}
            onClick={props.onDelete}
            mini
          >
            delete
          </StyledButton>
        </div>
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
