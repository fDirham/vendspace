import React from 'react';
import styles from './StyledButton.module.scss';

type StyledButtonProps = {
  children: any;
  onClick?: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  alternative?: boolean;
  mini?: boolean;
};

export default function StyledButton(props: StyledButtonProps) {
  return (
    <button
      type={props.type || 'button'}
      onClick={props.onClick}
      disabled={props.disabled}
      className={`${styles.button} ${props.alternative && styles.alternative} ${
        props.mini && styles.mini
      } ${props.className}`}
    >
      {props.children}
    </button>
  );
}
