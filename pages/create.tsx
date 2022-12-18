import PageContainer from 'components/all/PageContainer';
import StyledButton from 'components/all/StyledButton';
import StyledInput from 'components/all/StyledInput';
import { useRouter } from 'next/router';
import React, { FormEvent, useState } from 'react';
import styles from './CreatePage.module.scss';
import {
  MAX_LENGTH_STORE_DESCRIPTION,
  MAX_LENGTH_STORE_DETAIL,
  MAX_LENGTH_STORE_NAME,
} from 'utilities/constants';
import useUserAuth from 'hooks/useUserAuth';
import useAuthGate from 'hooks/useAuthGate';
import StyledTextArea from 'components/all/StyledTextArea';
import ControllerStores from 'controllers/ControllerStores';

export default function newstore() {
  const [name, setName] = useState<string>('');
  const [contact, setContact] = useState<string>('');
  const [payment, setPayment] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const router = useRouter();
  const currentUser = useUserAuth();
  useAuthGate(currentUser, router);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const createRes = await ControllerStores.createStore(
      currentUser!.handle,
      name,
      contact,
      payment,
      description
    );

    if (createRes.isError) return alert('Create failed, try again later');
    else alert('Store created!');
    router.push('/');
  }

  return (
    <PageContainer>
      <form className={styles.container} onSubmit={handleSubmit}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>New Store</h1>
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

        <StyledButton type='submit'>create</StyledButton>
      </form>
    </PageContainer>
  );
}
