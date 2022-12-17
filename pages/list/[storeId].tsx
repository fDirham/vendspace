import PageContainer from 'components/all/PageContainer';
import StyledButton from 'components/all/StyledButton';
import StyledInput from 'components/all/StyledInput';
import { useRouter } from 'next/router';
import React, { FormEvent, useState } from 'react';
import styles from './ListItemPage.module.scss';
import {
  MAX_LENGTH_ITEM_NAME,
  MAX_LENGTH_ITEM_PRICE,
  MAX_LENGTH_STORE_DESCRIPTION,
} from 'utilities/constants';
import useUserAuth from 'hooks/useUserAuth';
import useAuthGate from 'hooks/useAuthGate';
import StyledTextArea from 'components/all/StyledTextArea';
import ControllerStores from 'controllers/ControllerStores';
import VisualUploaderSystem from 'components/list/VisualUploaderSystem';
import { ItemVisual } from 'utilities/types';

export default function listitem() {
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [visuals, setVisuals] = useState<ItemVisual[]>([]);
  const [visualsToDelete, setVisualsToDelete] = useState<boolean[]>([]);

  const router = useRouter();
  const { storeId } = router.query;

  const currentUser = useUserAuth();
  useAuthGate(currentUser, router);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const res = await ControllerStores.listNewItem(
      currentUser!.handle,
      storeId as string,
      { name, price, description, visuals, id: '' },
      visualsToDelete
    );

    if (!res.isError) {
      window.alert('Item listed!');
      router.push('/s/' + currentUser?.handle + '/' + storeId);
    }
  }

  return (
    <PageContainer>
      <form className={styles.container} onSubmit={handleSubmit}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>New Item</h1>
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
          maxLength={MAX_LENGTH_STORE_DESCRIPTION}
        />

        <p className={styles.explainP}>
          Item condition / how long it's used / what you bought it for /
          external links / etc.
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
        <StyledButton type='submit'>add item</StyledButton>
      </form>
    </PageContainer>
  );
}
