import React, { FormEvent, useState } from 'react';
import styles from './ModalLinkFill.module.scss';
import ModalBase from 'components/all/ModalBase';
import { ScrapedItemData } from 'utilities/types';
import { ModalBaseProps } from 'components/all/ModalBase/ModalBase';
import StyledInput from 'components/all/StyledInput';
import StyledButton from 'components/all/StyledButton';
import ControllerScrape from 'controllers/ControllerScrape';
import LoadingSpinner from 'components/all/LoadingSpinner';

type ModalLinkFillProps = {
  open: boolean;
  onClose: () => void;
  onComplete: (scrapedData: ScrapedItemData) => void;
};

export default function ModalLinkFill(props: ModalLinkFillProps) {
  const [scrapeUrl, setScrapeUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const scrapeRes = await ControllerScrape.scrapeAmazonItem(scrapeUrl);
    setLoading(false);
    if (scrapeRes.isError) {
      alert('Scraping failed! Please ensure the link is valid.');
      console.log(scrapeRes.data);
      return;
    }
    alert('Success! Be sure to look over the details and make edits!');
    props.onComplete(scrapeRes.scrapedData!);
    props.onClose();
  }

  const renderContent = (modalProps: ModalBaseProps) => {
    if (loading) {
      return (
        <div className={styles.loadingContainer}>
          <LoadingSpinner className={styles.loadingSpinner} />
        </div>
      );
    }
    return (
      <form onSubmit={handleSubmit}>
        <p className={styles.topText}>
          Paste a link to an external site below and VendSpace will scrape
          images and information.
          <br />
          NOTE: Only works for Amazon.com for now.
        </p>
        <StyledInput
          value={scrapeUrl}
          onChange={(e) => setScrapeUrl(e.target.value)}
          className={styles.input}
          placeholder={'url'}
        />
        <StyledButton type='submit' className={styles.button}>
          go
        </StyledButton>
      </form>
    );
  };

  return (
    <ModalBase
      open={props.open}
      onClose={props.onClose}
      renderContent={renderContent}
      containerClassName={styles.container}
      canClose
    />
  );
}
