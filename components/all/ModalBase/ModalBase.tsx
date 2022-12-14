import React from 'react';
import styles from './ModalBase.module.scss';

export type ModalBaseProps = {
  open: boolean;
  onClose: () => void;
  renderContent: (props: ModalBaseProps) => any;
  containerClassName?: string;
};

export default function ModalBase(props: ModalBaseProps) {
  if (props.open)
    return (
      <div className={styles.container} onClick={props.onClose}>
        <div
          className={styles.modalContainer + ' ' + props.containerClassName}
          onClick={(e) => e.stopPropagation()}
        >
          {props.renderContent(props)}
        </div>
      </div>
    );

  return null;
}
