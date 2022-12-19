import ModalBase from 'components/all/ModalBase';
import StyledButton from 'components/all/StyledButton';
import React, { useState } from 'react';
import { StoreInfo } from 'utilities/types';
import styles from './InfoButtons.module.scss';
import ModalContactInfo from 'components/item/ModalContactInfo';

type InfoButtonsProps = {
  storeInfo: StoreInfo;
  isUser: boolean;
  setEditing: (newEditing: boolean) => void;
  editing: boolean;
};

export default function InfoButtons(props: InfoButtonsProps) {
  const [showInfo, setShowInfo] = useState<boolean>(false);

  return (
    <div className={styles.infoButtonsContainer}>
      <ModalContactInfo
        open={showInfo}
        onClose={() => setShowInfo(false)}
        storeInfo={props.storeInfo}
      />
      {props.isUser && (
        <StyledButton
          alternative
          mini
          className={styles.infoButton}
          onClick={() => props.setEditing(!props.editing)}
        >
          {props.editing ? 'stop edit' : 'edit items'}
        </StyledButton>
      )}
      <StyledButton
        alternative
        mini
        className={styles.infoButton}
        onClick={() => setShowInfo(true)}
      >
        contact & payment
      </StyledButton>
    </div>
  );
}
