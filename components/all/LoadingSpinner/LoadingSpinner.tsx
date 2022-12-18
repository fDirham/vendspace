import React from 'react';
import styles from './LoadingSpinner.module.scss';

type LoadingSpinnerProps = { className?: string };

export default function LoadingSpinner(props: LoadingSpinnerProps) {
  return (
    <div
      className={`${styles.container} ${
        props.className ? props.className : ''
      }`}
    >
      <div className={styles.spinner}></div>
    </div>
  );
}
