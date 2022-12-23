import React from 'react';
import styles from './ModalShareSocial.module.scss';
import ModalBase from '../ModalBase';
import { ModalBaseProps } from '../ModalBase/ModalBase';
import {
  EmailShareButton,
  EmailIcon,
  FacebookShareButton,
  FacebookIcon,
  LineShareButton,
  LineIcon,
  RedditShareButton,
  RedditIcon,
  TelegramShareButton,
  TelegramIcon,
  TwitterShareButton,
  TwitterIcon,
  WhatsappShareButton,
  WhatsappIcon,
  WorkplaceShareButton,
  WorkplaceIcon,
} from 'react-share';
import StyledButton from '../StyledButton';

type ModalShareSocialProps = {
  url: string;
  onClose: () => void;
};

const iconSize = 60;
export default function ModalShareSocial(props: ModalShareSocialProps) {
  async function handleCopy() {
    await copyTextToClipboard(props.url);
    alert('Link copied!');
  }

  async function copyTextToClipboard(text: string) {
    if ('clipboard' in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand('copy', true, text);
    }
  }

  const renderContent = (modalProps: ModalBaseProps) => {
    if (!props.url) return null;
    return (
      <>
        <p className={styles.titleText}>Share</p>
        <div className={styles.copyContainer}>
          <p className={styles.urlText}>{props.url}</p>
          <StyledButton mini className={styles.copyButton} onClick={handleCopy}>
            copy
          </StyledButton>
        </div>
        <div className={styles.buttonContainer}>
          <FacebookShareButton url={props.url}>
            <FacebookIcon round size={iconSize} />
          </FacebookShareButton>
          <WorkplaceShareButton url={props.url}>
            <WorkplaceIcon round size={iconSize} />
          </WorkplaceShareButton>
          <TelegramShareButton url={props.url}>
            <TelegramIcon round size={iconSize} />
          </TelegramShareButton>
          <WhatsappShareButton url={props.url}>
            <WhatsappIcon round size={iconSize} />
          </WhatsappShareButton>
          <LineShareButton url={props.url}>
            <LineIcon round size={iconSize} />
          </LineShareButton>
          <EmailShareButton url={props.url}>
            <EmailIcon round size={iconSize} />
          </EmailShareButton>
          <RedditShareButton url={props.url}>
            <RedditIcon round size={iconSize} />
          </RedditShareButton>
          <TwitterShareButton url={props.url}>
            <TwitterIcon round size={iconSize} />
          </TwitterShareButton>
        </div>
      </>
    );
  };

  return (
    <ModalBase
      open={!!props.url}
      onClose={props.onClose}
      renderContent={renderContent}
      containerClassName={styles.container}
      canClose
    />
  );
}
