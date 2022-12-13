import PageContainer from 'components/all/PageContainer';
import StyledButton from 'components/all/StyledButton';
import ControllerAuth from 'controllers/ControllerAuth';
import { useRouter } from 'next/router';
import React, { FormEvent, useEffect, useState } from 'react';
import styles from './StorePage.module.scss';
import useUserAuth from 'hooks/useUserAuth';
import ControllerStores from 'controllers/ControllerStores';
import { PublicUserData, StoreInfo } from 'utilities/types';
import { colorA } from 'styles/constants/colors';
import InfoButtons from 'components/store/InfoButtons';

export default function storepage() {
  const [storeInfo, setStoreInfo] = useState<StoreInfo>();
  const [owner, setOwner] = useState<PublicUserData>();

  const currentUser = useUserAuth();
  const router = useRouter();
  const { handle, storeId } = router.query;

  useEffect(() => {
    if (storeId && handle) {
      getStoreInfo();
      getUserData();
    }
  }, [storeId, handle]);

  async function getStoreInfo() {
    const getRes = await ControllerStores.getStoreInfo(
      handle as string,
      storeId as string
    );
    if (getRes.store) {
      const { store } = getRes;
      setStoreInfo(store);
    } else window.alert('failed');
  }

  async function getUserData() {
    const getRes = await ControllerAuth.getPublicUserData(handle as string);
    if (getRes.userData) {
      setOwner(getRes.userData);
    }
  }

  function handleNewItem() {
    router.push(`/list/${storeId}`);
  }

  if (!storeInfo || !owner) return null;
  return (
    <PageContainer className={styles.container}>
      <div className={styles.topContainer}>
        <h1 className={styles.title}>{storeInfo.name}</h1>
        <div className={styles.ownerContainer}>
          <p className={styles.ownerInfoText}>
            <span className={styles.ownerName}>{owner.displayName}</span>{' '}
            <span className={styles.ownerHandle}>@{owner.handle}</span>
          </p>
        </div>
        <InfoButtons storeInfo={storeInfo} />
      </div>
      {!!storeInfo.description && (
        <div className={styles.descriptionContainer}>
          {storeInfo.description}
        </div>
      )}
      {currentUser?.handle === handle && (
        <StyledButton onClick={handleNewItem}>New item</StyledButton>
      )}
    </PageContainer>
  );
}
