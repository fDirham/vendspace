import PageContainer from 'components/all/PageContainer';
import StyledButton from 'components/all/StyledButton';
import StyledInput from 'components/all/StyledInput';
import { useRouter } from 'next/router';
import React, { FormEvent, useEffect, useState } from 'react';
import styles from './ChangeItemRepage.module.scss';
import {
  MAX_LENGTH_ITEM_DESCRIPTION,
  MAX_LENGTH_ITEM_NAME,
  MAX_LENGTH_ITEM_PRICE,
} from 'utilities/constants';
import useUserAuth from 'hooks/useUserAuth';
import useAuthGate from 'hooks/useAuthGate';
import StyledTextArea from 'components/all/StyledTextArea';
import VisualUploaderSystem from 'components/newItem/VisualUploaderSystem';
import { ItemInfo, ItemVisual, ScrapedItemData } from 'utilities/types';
import ControllerItems from 'controllers/ControllerItems';
import ModalLoading from 'components/all/ModalLoading';
import useVisualsUploader from 'hooks/useVisualsUploader';
import PageHeader from 'components/all/PageHeader';
import Head from 'next/head';
import ModalLinkFill from 'components/newItem/ModalLinkFill';

type ChangeItemRepageProps = {
  metaTitle: string;
  headerTitle: string;
  pageTitle: string;
  initialItem?: ItemInfo;
  edit: boolean;
};

export default function ChangeItemRepage(props: ChangeItemRepageProps) {
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<string>('$');
  const [originalPrice, setOriginalPrice] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [visuals, setVisuals] = useState<ItemVisual[]>([]);
  const [visualsToDelete, setVisualsToDelete] = useState<boolean[]>([]);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [openLinkFill, setOpenLinkFill] = useState<boolean>(!props.edit);

  const router = useRouter();
  const { storeId } = router.query;

  const currentUser = useUserAuth();
  useAuthGate(currentUser, router);
  const uploadVisuals = useVisualsUploader(
    setLoadingMessage,
    currentUser!,
    updateDB
  );

  useEffect(() => {
    if (props.initialItem) {
      const item = props.initialItem;
      setName(item.name);
      setPrice(item.price);
      setOriginalPrice(item.originalPrice || '');
      setDescription(item.description);
      setVisuals(item.visuals);
    }
  }, [props.initialItem]);

  async function updateDB(uploadUrls: string[]) {
    setLoadingMessage('Wrapping up...');

    // Add
    if (!props.edit) {
      // Set visuals correctly
      let newVisuals = uploadUrls.length
        ? (visuals.map((vis, index) => {
            return { uri: uploadUrls[index] };
          }) as ItemVisual[])
        : visuals;
      const res = await ControllerItems.addNewItem(
        currentUser!.handle,
        storeId as string,
        {
          name,
          price,
          description,
          visuals: newVisuals,
          originalPrice,
          id: '',
        },
        visualsToDelete
      );

      if (!res.isError) {
        alert('Item listed!');
        router.push('/s/' + currentUser?.handle + '/' + storeId);
      } else {
        alert('Something went wrong...');
        console.log(res.data);
      }
    }
    // Edit
    else {
      const newVisuals = [...visuals];
      for (let i = 0; i < newVisuals.length; i++) {
        const curr = newVisuals[i];
        if (curr.file) newVisuals[i] = { uri: uploadUrls.shift()! };
      }

      const res = await ControllerItems.editItem(
        currentUser!.handle,
        storeId as string,
        {
          name,
          price,
          description,
          visuals: newVisuals,
          originalPrice,
          id: props.initialItem?.id!,
        },
        visualsToDelete
      );

      if (!res.isError) {
        alert('Item updated!');
        router.push('/s/' + currentUser?.handle + '/' + storeId);
      } else {
        alert('Something went wrong...');
        console.log(res.data);
      }
    }
  }

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (price == '$') {
      alert('Please input a price');
      return;
    }

    if (!visuals.length) {
      const res = confirm(
        "Images are optional but are highly recommended to get buyers interested. Are you sure you don't want to add any?"
      );
      if (!res) return;
    }

    const visualFiles = visuals
      .filter((vis) => !!vis.file)
      .map((vis) => vis.file) as File[];

    uploadVisuals(visualFiles);
  }

  function onLinkFillScrape(itemData: ScrapedItemData) {
    setName(itemData.name);
    setOriginalPrice(itemData.price);
    const newVisuals = itemData.imageSrcs.map((strSrc) => {
      return { uri: strSrc } as ItemVisual;
    });
    setVisuals(newVisuals);
    setDescription(itemData.url);
  }

  return (
    <PageContainer>
      <Head>
        <title>{props.metaTitle}</title>
      </Head>
      <PageHeader title={props.headerTitle} onBack={() => router.back()} />
      <ModalLoading message={loadingMessage} />
      <ModalLinkFill
        open={openLinkFill}
        onClose={() => setOpenLinkFill(false)}
        onComplete={onLinkFillScrape}
      />
      <form className={styles.container} onSubmit={handleSubmit}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>{props.pageTitle}</h1>
        </div>

        <StyledButton
          className={styles.linkFillButton}
          mini
          onClick={() => setOpenLinkFill(true)}
        >
          link fill
        </StyledButton>
        <StyledInput
          placeholder='Item Name*'
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.styledInput}
          required
          maxLength={MAX_LENGTH_ITEM_NAME}
        />
        <p className={styles.explainP}>What are you selling?</p>

        <StyledInput
          placeholder='Price*'
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className={styles.styledInput}
          maxLength={MAX_LENGTH_ITEM_PRICE}
          minLength={2}
          required
        />
        <p className={styles.explainP}>
          What are you selling the item for? Can be in any currency you want.
        </p>

        <StyledInput
          placeholder='Original Price'
          value={originalPrice}
          onChange={(e) => setOriginalPrice(e.target.value)}
          className={styles.styledInput}
          maxLength={MAX_LENGTH_ITEM_PRICE}
        />
        <p className={styles.explainP}>
          What did you buy the item for? (optional)
        </p>

        <StyledTextArea
          placeholder='Description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.styledInput}
          maxLength={MAX_LENGTH_ITEM_DESCRIPTION}
        />

        <p className={styles.explainP}>
          Item condition / how long it's used / what you bought it for /
          external links / etc. Links will be parsed
        </p>

        <h2 className={styles.imagesText}>Pictures</h2>
        <VisualUploaderSystem
          visuals={visuals}
          setVisuals={setVisuals}
          visualsToDelete={visualsToDelete}
          setVisualsToDelete={setVisualsToDelete}
        />
        <p className={styles.explainP}>
          Optional. The first picture will be the cover picture. If there are no
          pictures, only text will appear.
        </p>
        <div className={styles.actionContainer}>
          <StyledButton type='submit'>save</StyledButton>
        </div>
      </form>
    </PageContainer>
  );
}
