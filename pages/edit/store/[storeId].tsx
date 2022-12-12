import PageContainer from 'components/all/PageContainer';
import StyledButton from 'components/all/StyledButton';
import StyledInput from 'components/all/StyledInput';
import ControllerAuth from 'controllers/ControllerAuth';
import { useRouter } from 'next/router';
import React, { FormEvent, useEffect, useState } from 'react';
import styles from 'pages/NewStorePage.module.scss';
import {
  MAX_LENGTH_HANDLE,
  MAX_LENGTH_NAME,
  MAX_LENGTH_STORE_DESCRIPTION,
  MAX_LENGTH_STORE_DETAIL,
  MAX_LENGTH_STORE_NAME,
} from 'utilities/constants';
import useUserAuth from 'hooks/useUserAuth';
import useAuthGate from 'hooks/useAuthGate';
import StyledTextArea from 'components/all/StyledTextArea';
import ControllerStores from 'controllers/ControllerStores';

export default function editstore() {
  const [name, setName] = useState<string>('');
  const [contact, setContact] = useState<string>('');
  const [payment, setPayment] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const currentUser = useUserAuth();
  const router = useRouter();
  const { storeId } = router.query;

  useAuthGate(currentUser, router);

  useEffect(() => {
    if (storeId) {
      getStoreInfo();
    }
  }, [storeId]);

  async function getStoreInfo() {
    const getRes = await ControllerStores.getStoreInfo(storeId as string);
    if (getRes.store) {
      const { store } = getRes;
      setName(store.name);
      setPayment(store.payment);
      setContact(store.contact);
      setDescription(store.description);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const newStoreInfo = {
      id: storeId as string,
      name,
      payment,
      contact,
      description,
    };
    const updateRes = await ControllerStores.updateStoreInfo(newStoreInfo);

    console.log(updateRes);
    if (updateRes.isError)
      return window.alert('Update failed, try again later');
    else window.alert('Store updated!');
    router.push('/');
  }

  if (!name) return null;
  return (
    <PageContainer>
      <form className={styles.container} onSubmit={handleSubmit}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Edit Store</h1>
        </div>

        <StyledInput
          placeholder='Store Name*'
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={styles.styledInput}
          required
          maxLength={MAX_LENGTH_STORE_NAME}
        />
        <p className={styles.explainP}>A name for your store</p>

        <StyledInput
          placeholder='Contact Info*'
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className={styles.styledInput}
          required
          maxLength={MAX_LENGTH_STORE_DETAIL}
        />
        <p className={styles.explainP}>
          How should people contact you when buying from your store? An email?
          Phone number?
        </p>

        <StyledInput
          placeholder='Payment Info*'
          value={payment}
          onChange={(e) => setPayment(e.target.value)}
          className={styles.styledInput}
          required
          maxLength={MAX_LENGTH_STORE_DETAIL}
        />
        <p className={styles.explainP}>
          How do you accept payments? Venmo? PayPal? Cash only?
        </p>

        <StyledTextArea
          placeholder='Description'
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.styledInput}
          maxLength={MAX_LENGTH_STORE_DESCRIPTION}
        />
        <p className={styles.explainP}>
          Anything else you would like buyers to know about your store?
        </p>

        <StyledButton type='submit'>update</StyledButton>
      </form>
    </PageContainer>
  );
}
