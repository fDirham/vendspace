import React, { ChangeEvent, FormEvent } from 'react';
import styles from './StyledInput.module.scss';

type StyledInputProps = {
  type?: string;
  placeholder?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  value: string;
  maxLength?: number;
  className?: string;
  required?: boolean;
  minLength?: number;
};

export default function StyledInput(props: StyledInputProps) {
  return (
    <input
      type={props.type || 'text'}
      placeholder={props.placeholder}
      onChange={props.onChange}
      value={props.value}
      maxLength={props.maxLength}
      className={styles.input + ' ' + props.className}
      required={props.required}
      minLength={props.minLength}
    />
  );
}
