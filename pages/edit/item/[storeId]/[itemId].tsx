import PageContainer from 'components/all/PageContainer';
import StyledButton from 'components/all/StyledButton';
import StyledInput from 'components/all/StyledInput';
import { useRouter } from 'next/router';
import React, { FormEvent, useEffect, useState } from 'react';
import styles from 'pages/list/ListItemPage.module.scss';
import {
  MAX_LENGTH_ITEM_DESCRIPTION,
  MAX_LENGTH_ITEM_NAME,
  MAX_LENGTH_ITEM_PRICE,
} from 'utilities/constants';
import useUserAuth from 'hooks/useUserAuth';
import useAuthGate from 'hooks/useAuthGate';
import StyledTextArea from 'components/all/StyledTextArea';
import VisualUploaderSystem from 'components/newItem/VisualUploaderSystem';
import { ItemVisual } from 'utilities/types';
import ControllerItems from 'controllers/ControllerItems';
import ModalLoading from 'components/all/ModalLoading';
import useVisualsUploader from 'hooks/useVisualsUploader';

export default function edititem() {
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [visuals, setVisuals] = useState<ItemVisual[]>([]);
  const [visualsToDelete, setVisualsToDelete] = useState<boolean[]>([]);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [initialLoad, setInitialLoad] = useState<boolean>(false);

  const router = useRouter();
  const { storeId, itemId } = router.query;

  const currentUser = useUserAuth();
  useAuthGate(currentUser, router);
  const uploadVisuals = useVisualsUploader(
    setLoadingMessage,
    currentUser!,
    updateDB
  );

  useEffect(() => {
    getItemInfo();
  }, [storeId, itemId, currentUser]);

  async function getItemInfo() {
    if (!storeId || !itemId || !currentUser) return;
    const getRes = await ControllerItems.getStoreItem(
      currentUser.handle,
      storeId as string,
      itemId as string
    );
    if (!getRes.isError) {
      const item = getRes.item!;
      console.log(item);
      setName(item.name);
      setPrice(item.price);
      setDescription(item.description);
      setVisuals(item.visuals);
      setInitialLoad(true);
    }
  }

  async function updateDB(uploadUrls: string[]) {
    setLoadingMessage('Wrapping up...');
    // Set visuals correctly
    const newVisuals = [...visuals];
    for (let i = 0; i < newVisuals.length; i++) {
      const curr = newVisuals[i];
      if (curr.file) newVisuals[i] = { uri: uploadUrls.shift()! };
    }

    // Upload
    const res = await ControllerItems.editItem(
      currentUser!.handle,
      storeId as string,
      { name, price, description, visuals: newVisuals, id: itemId as string },
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

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

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

  if (!initialLoad) return null;
  return (
    <PageContainer>
      <ModalLoading message={loadingMessage} />
      <form className={styles.container} onSubmit={handleSubmit}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Edit Item</h1>
        </div>

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
          required
          maxLength={MAX_LENGTH_ITEM_PRICE}
        />
        <p className={styles.explainP}>
          What is the price of the item? Can be in any currency you want.
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
        <StyledButton type='submit'>save</StyledButton>
      </form>
    </PageContainer>
  );
}
