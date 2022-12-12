import React from 'react';
import styles from './StyledButton.module.scss';

type StyledButtonProps = {
  children: any;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
};

export default function StyledButton(props: StyledButtonProps) {
  return (
    <button
      type={props.type || 'button'}
      onClick={props.onClick}
      disabled={props.disabled}
      className={styles.button + ' ' + props.className}
    >
      {props.children}
    </button>
  );
}
