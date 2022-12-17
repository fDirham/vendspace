import ControllerItems from 'controllers/ControllerItems';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { ItemInfo } from 'utilities/types';
import styles from './ItemPage.module.scss';
import VisualSystem from 'components/item/VisualSystem';
import PageContainer from 'components/all/PageContainer';

export default function itemPage() {
  const router = useRouter();
  const { handle, storeId, itemId } = router.query;
  const [itemInfo, setItemInfo] = useState<ItemInfo>();

  useEffect(() => {
    getItemInfo();
  }, [handle, storeId, itemId]);

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

  if (!itemInfo) return;
  return (
    <PageContainer className={styles.container}>
      <VisualSystem visuals={itemInfo?.visuals} />
    </PageContainer>
  );
}
