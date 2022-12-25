import PageContainer from 'components/all/PageContainer';
import StyledButton from 'components/all/StyledButton';
import StyledInput from 'components/all/StyledInput';
import { useRouter } from 'next/router';
import React, { FormEvent, useEffect, useState } from 'react';
import styles from './ChangeStoreRepage.module.scss';
import {
  MAX_LENGTH_STORE_DESCRIPTION,
  MAX_LENGTH_STORE_DETAIL,
  MAX_LENGTH_STORE_NAME,
} from 'utilities/constants';
import useUserAuth from 'hooks/useUserAuth';
import useAuthGate from 'hooks/useAuthGate';
import StyledTextArea from 'components/all/StyledTextArea';
import ControllerStores from 'controllers/ControllerStores';
import PageHeader from 'components/all/PageHeader';
import Head from 'next/head';
import { StoreInfo } from 'utilities/types';

type ChangeStoreRepageProps = {
  metaTitle: string;
  headerTitle: string;
  pageTitle: string;
  initialStore?: StoreInfo;
  edit: boolean;
};

export default function ChangeStoreRepage(props: ChangeStoreRepageProps) {
  const [name, setName] = useState<string>('');
  const [contact, setContact] = useState<string>('');
  const [payment, setPayment] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const router = useRouter();
  const currentUser = useUserAuth();
  useAuthGate(currentUser, router);

  useEffect(() => {
    if (props.initialStore) {
      const store = props.initialStore;
      setName(store.name);
      setPayment(store.payment);
      setContact(store.contact);
      setDescription(store.description);
    }
  }, [props.initialStore]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Edit
    if (props.edit) {
      const newStoreInfo = {
        id: props.initialStore?.id!,
        name,
        payment,
        contact,
        description,
      };
      const updateRes = await ControllerStores.updateStoreInfo(
        currentUser!.handle,
        newStoreInfo
      );

      if (updateRes.isError)
        return alert('Update failed, please try again later');
      else alert('Store updated!');
      router.back();
    }

    // Add
    else {
      const createRes = await ControllerStores.createStore(
        currentUser!.handle,
        name,
        contact,
        payment,
        description
      );

      if (createRes.isError)
        return alert('Create failed, please try again later');

      alert('Store created!');
      router.push(`/s/${currentUser?.handle}/${createRes.id}`);
    }
  }

  return (
    <PageContainer>
      <Head>
        <title>{props.metaTitle}</title>
      </Head>

      <PageHeader title={props.headerTitle} onBack={() => router.back()} />
      <form className={styles.container} onSubmit={handleSubmit}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>{props.pageTitle}</h1>
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

        <StyledButton type='submit'>save</StyledButton>
      </form>
    </PageContainer>
  );
}
