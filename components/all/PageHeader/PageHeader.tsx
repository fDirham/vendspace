import React from 'react';
import styles from './PageHeader.module.scss';

type PageHeaderProps = {
  title: string;
  onBack?: () => void;
  onShare?: () => void;
};

export default function PageHeader(props: PageHeaderProps) {
  return (
    <>
      <div className={styles.placeholder}></div>
      <div className={styles.container}>
        {!!props.onBack ? (
          <img
            src='/icons/back.png'
            alt='back'
            onClick={props.onBack}
            className={styles.icon}
          />
        ) : (
          <div />
        )}
        <div className={styles.titleContainer}>
          <p className={styles.title}>{props.title}</p>
        </div>
        {!!props.onShare ? (
          <img
            src='/icons/share.png'
            alt='share'
            onClick={props.onShare}
            className={styles.icon}
          />
        ) : (
          <div />
        )}
      </div>
    </>
  );
}
