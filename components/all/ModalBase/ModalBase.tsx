import React from 'react';
import styles from './ModalBase.module.scss';
import StyledButton from '../StyledButton';
import ReactLinkify from 'react-linkify';

export type ModalBaseProps = {
  open: boolean;
  onClose: () => void;
  renderContent: (props: ModalBaseProps) => any;
  containerClassName?: string;
  canClose?: boolean;
};

export default function ModalBase(props: ModalBaseProps) {
  if (props.open)
    return (
      <div className={styles.container}>
        <div
          className={styles.modalContainer + ' ' + props.containerClassName}
          onClick={(e) => e.stopPropagation()}
        >
          <ReactLinkify>{props.renderContent(props)}</ReactLinkify>
          {props.canClose && (
            <StyledButton className={styles.button} onClick={props.onClose}>
              close
            </StyledButton>
          )}
        </div>
      </div>
    );

  return null;
}
