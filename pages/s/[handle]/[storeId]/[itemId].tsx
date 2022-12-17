import ControllerItems from 'controllers/ControllerItems';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { ItemInfo, PublicUserData, StoreInfo } from 'utilities/types';
import styles from './ItemPage.module.scss';
import VisualSystem from 'components/item/VisualSystem';
import PageContainer from 'components/all/PageContainer';
import StyledButton from 'components/all/StyledButton';
import ControllerAuth from 'controllers/ControllerAuth';
import ControllerStores from 'controllers/ControllerStores';
import ModalContactInfo from 'components/item/ModalContactInfo';

export default function itemPage() {
  const router = useRouter();
  const { handle, storeId, itemId } = router.query;
  const [itemInfo, setItemInfo] = useState<ItemInfo>();
  const [storeInfo, setStoreInfo] = useState<StoreInfo>();
  const [sellerData, setSellerData] = useState<PublicUserData>();
  const [openInfo, setOpenInfo] = useState<boolean>(false);

  useEffect(() => {
    getItemInfo();
  }, [handle, storeId, itemId]);

  useEffect(() => {
    getStoreInfo();
  }, [handle, storeId]);

  useEffect(() => {
    getSellerInfo();
  }, [handle]);

  async function getItemInfo() {
    if (!handle || !storeId || !itemId) return;
    const getRes = await ControllerItems.getStoreItem(
      handle as string,
      storeId as string,
      itemId as string
    );
    if (!getRes.isError) {
      setItemInfo(getRes.item!);
    }
  }

  async function getStoreInfo() {
    if (!handle || !storeId) return;
    const getRes = await ControllerStores.getStoreInfo(
      handle as string,
      storeId as string
    );
    if (!getRes.isError) {
      setStoreInfo(getRes.store!);
    }
  }

  async function getSellerInfo() {
    if (!handle) return;
    const getRes = await ControllerAuth.getPublicUserData(handle as string);
    if (!getRes.isError) {
      setSellerData(getRes.userData!);
    }
  }

  if (!itemInfo || !storeInfo || !sellerData) return;
  return (
    <PageContainer className={styles.container}>
      <ModalContactInfo
        open={openInfo}
        onClose={() => setOpenInfo(false)}
        storeInfo={storeInfo}
      />
      <VisualSystem visuals={itemInfo?.visuals} />
      <div className={styles.infoContainer}>
        <h1>{itemInfo.name}</h1>
        <p className={styles.whoText}>
          <span className={styles.storeText}>{storeInfo.name}</span>
          {' - '}
          <span className={styles.sellerName}>{sellerData.displayName}</span>
        </p>
        <p className={styles.price}>{itemInfo.price}</p>
        <p className={styles.description}>{itemInfo.description}</p>
      </div>
      <div className={styles.actionContainer}>
        <StyledButton onClick={() => setOpenInfo(true)}>
          contact seller
        </StyledButton>
      </div>
    </PageContainer>
  );
}
