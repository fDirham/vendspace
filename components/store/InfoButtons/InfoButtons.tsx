import ModalBase from 'components/all/ModalBase';
import StyledButton from 'components/all/StyledButton';
import React, { useState } from 'react';
import { StoreInfo } from 'utilities/types';
import styles from './InfoButtons.module.scss';

type InfoButtonsProps = {
  storeInfo: StoreInfo;
};

export default function InfoButtons(props: InfoButtonsProps) {
  const [showPayment, setShowPayment] = useState<boolean>(false);
  const [showContact, setShowContact] = useState<boolean>(false);

  const renderInfo = (isContact: boolean) => {
    const title = isContact ? 'Contact info' : 'Payment info';
    const text = isContact ? props.storeInfo.contact : props.storeInfo.payment;
    return (
      <div className={styles.infoContainer}>
        <p className={styles.infoTitle}>
          <b>{title}</b>
        </p>
        <p className={styles.infoText}>{text}</p>
      </div>
    );
  };

  return (
    <div className={styles.infoButtonsContainer}>
      <ModalBase
        open={showContact}
        onClose={() => setShowContact(false)}
        renderContent={() => renderInfo(true)}
      />
      <ModalBase
        open={showPayment}
        onClose={() => setShowPayment(false)}
        renderContent={() => renderInfo(false)}
      />
      <StyledButton
        alternative
        mini
        className={styles.infoButton}
        onClick={() => setShowContact(true)}
      >
        contact info
      </StyledButton>
      <StyledButton
        alternative
        mini
        className={styles.infoButton}
        onClick={() => setShowPayment(true)}
      >
        payment info
      </StyledButton>
    </div>
  );
}
