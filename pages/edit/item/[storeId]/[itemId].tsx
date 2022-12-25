import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import useUserAuth from 'hooks/useUserAuth';
import useAuthGate from 'hooks/useAuthGate';
import { ItemInfo } from 'utilities/types';
import ControllerItems from 'controllers/ControllerItems';
import ChangeItemRepage from 'components/repages/ChangeItemRepage';

export default function editItem() {
  const [initialItem, setInitialItem] = useState<ItemInfo>();

  const router = useRouter();
  const { storeId, itemId } = router.query;

  const currentUser = useUserAuth();
  useAuthGate(currentUser, router);

  useEffect(() => {
    getItemInfo();
  }, [storeId, itemId, currentUser]);

  async function getItemInfo() {
    if (!storeId || !itemId || !currentUser) return;
    const getRes = await ControllerItems.getItem(
      currentUser.handle,
      storeId as string,
      itemId as string
    );
    if (!getRes.isError) {
      const item = getRes.item!;
      setInitialItem(item);
    }
  }

  if (!initialItem) return null;
  return (
    <ChangeItemRepage
      edit
      pageTitle='Edit Item'
      metaTitle='Edit VendSpace Item'
      headerTitle='edit'
      initialItem={initialItem}
    />
  );
}
