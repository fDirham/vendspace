import React from 'react';
import styles from './ModalEditMenu.module.scss';
import ModalBase, { ModalBaseProps } from 'components/all/ModalBase/ModalBase';
import { NextRouter } from 'next/router';
import StyledButton from 'components/all/StyledButton';
import { ItemInfo } from 'utilities/types';

type ModalEditMenuProps = {
  open: boolean;
  onClose: () => void;
  router: NextRouter;
  item: ItemInfo;
};

export default function ModalEditMenu(props: ModalEditMenuProps) {
  const { storeId } = props.router.query;

  function handleEditItem() {
    props.router.push(`/edit/item/${storeId as string}/${props.item.id}`);
  }

  const renderContent = (modalProps: ModalBaseProps) => {
    return (
      <>
        <p className={styles.itemName}>{props.item.name}</p>
        <StyledButton className={styles.button} onClick={handleEditItem}>
          edit
        </StyledButton>
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
