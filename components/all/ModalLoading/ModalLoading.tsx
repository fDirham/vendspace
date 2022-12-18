import React from 'react';
import styles from './ModalLoading.module.scss';
import ModalBase from '../ModalBase';
import { ModalBaseProps } from '../ModalBase/ModalBase';
import LoadingSpinner from '../LoadingSpinner';

type ModalLoadingProps = {
  message: string;
};

export default function ModalLoading(props: ModalLoadingProps) {
  const renderContent = (modalProps: ModalBaseProps) => {
    return (
      <>
        <LoadingSpinner className={styles.loadingSpinner} />
        <p className={styles.text}>{props.message}</p>
      </>
    );
  };

  return (
    <ModalBase
      open={!!props.message}
      onClose={() => null}
      renderContent={renderContent}
      containerClassName={styles.container}
    />
  );
}
