import PageContainer from 'components/all/PageContainer';
import StyledButton from 'components/all/StyledButton';
import StyledInput from 'components/all/StyledInput';
import { useRouter } from 'next/router';
import React, { FormEvent, useEffect, useState } from 'react';
import styles from './ClaimPage.module.scss';
import { ADMIN_CLAIM_HANDLE } from 'utilities/constants';
import useUserAuth from 'hooks/useUserAuth';
import ControllerStores from 'controllers/ControllerStores';
import PageHeader from 'components/all/PageHeader';
import Head from 'next/head';
import { ItemInfo, StoreInfo } from 'utilities/types';
import ControllerClaim from 'controllers/ControllerClaim';
import ControllerItems from 'controllers/ControllerItems';
import { PATH_SIGN_IN } from 'utilities/pathnames';
import ModalLoading from 'components/all/ModalLoading';

const dummyStore = {
  contact: 'cool beans',
  name: 'claim store',
  description: 'wgijgfiojwegjgew',
  payment: 'lol',
  timeCreated: '',
  claimId: 'super',
  claimPersonName: 'mario luigi',
  id: 'E11ZNU',
};

// TODO: remove dummy
export default function claimstore() {
  const [code, setCode] = useState<string>('');
  const [storeInfo, setStoreInfo] = useState<StoreInfo | undefined>();
  const [loadingMsg, setLoadingMsg] = useState<string>('');
  const [storeItems, setStoreItems] = useState<ItemInfo[]>([]);

  const router = useRouter();
  const currentUser = useUserAuth();

  // Locks those that already signed up out
  useEffect(() => {
    if (!!currentUser) {
      router.replace('/');
    }
  }, [currentUser]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Get store id
    // TODO: LOADING!!!
    setLoadingMsg('Verifying code...');
    const codeRes = await ControllerClaim.useCodeForStore(code);
    if (codeRes.isError) {
      alert('Something went wrong.');
      console.log(codeRes.data);
      return;
    }
    const { storeId } = codeRes!;
    if (!storeId) {
      alert('Invalid code, please try again.');
      setLoadingMsg('');
      return;
    }

    setLoadingMsg('Retrieving store...');
    const getStoreRes = await ControllerStores.getStoreInfo(
      ADMIN_CLAIM_HANDLE as string,
      storeId as string
    );

    const getItemsRes = await ControllerItems.getStoreItems(
      ADMIN_CLAIM_HANDLE as string,
      storeId as string
    );

    if (getStoreRes.isError || getItemsRes.isError) {
      alert('Something went wrong.');
      console.log(getStoreRes.data);
      console.log(getItemsRes.data);
      setLoadingMsg('');
    }

    setStoreInfo(getStoreRes.store);
    setStoreItems(getItemsRes.items!);
    setLoadingMsg('');
  }

  function handleClaim() {
    alert("We'll sign you up so you can claim " + storeInfo!.name);
    router.push(PATH_SIGN_IN + '?claim=' + code);
  }

  if (!!storeInfo) {
    return (
      <PageContainer className={styles.foundContainer}>
        <Head>
          <title>Claim VendSpace Store</title>
        </Head>

        <PageHeader title={'claim'} onBack={() => setStoreInfo(undefined)} />
        <p className={styles.questionText}>Is this your store?</p>
        <h2 className={styles.storeName}>{storeInfo.name}</h2>
        <p className={styles.personName}>{storeInfo.claimPersonName}</p>
        <StyledButton onClick={handleClaim} className={styles.finalClaimButton}>
          claim
        </StyledButton>
      </PageContainer>
    );
  }
  return (
    <PageContainer>
      <Head>
        <title>Claim VendSpace Store</title>
      </Head>

      <ModalLoading message={loadingMsg} />

      <PageHeader title={'claim'} onBack={() => router.back()} />
      <form className={styles.container} onSubmit={handleSubmit}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Claim Store</h1>
        </div>

        <StyledInput
          placeholder='Store code*'
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className={styles.styledInput}
          required
          maxLength={6}
        />
        <p className={styles.explainP}>What is the code we gave you?</p>

        <StyledButton type='submit'>claim</StyledButton>
      </form>
    </PageContainer>
  );
}
