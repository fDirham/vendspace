import React, { ChangeEvent, FormEvent } from 'react';
import styles from './StyledTextArea.module.scss';

type StyledTextAreaProps = {
  placeholder?: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  value: string;
  maxLength?: number;
  className?: string;
  required?: boolean;
};

export default function StyledTextArea(props: StyledTextAreaProps) {
  return (
    <textarea
      placeholder={props.placeholder}
      onChange={props.onChange}
      value={props.value}
      maxLength={props.maxLength}
      className={styles.textArea + ' ' + props.className}
      required={props.required}
    />
  );
}
