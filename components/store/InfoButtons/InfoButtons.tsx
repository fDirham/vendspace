import ModalBase from 'components/all/ModalBase';
import StyledButton from 'components/all/StyledButton';
import React, { useState } from 'react';
import { StoreInfo } from 'utilities/types';
import styles from './InfoButtons.module.scss';
import ModalContactInfo from 'components/item/ModalContactInfo';

type InfoButtonsProps = {
  storeInfo: StoreInfo;
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
