import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import useUserAuth from 'hooks/useUserAuth';
import useAuthGate from 'hooks/useAuthGate';
import ControllerStores from 'controllers/ControllerStores';
import { StoreInfo } from 'utilities/types';
import ChangeStoreRepage from 'components/repages/ChangeStoreRepage';

export default function editStore() {
  const [initialStore, setInitialStore] = useState<StoreInfo>();

  const currentUser = useUserAuth();
  const router = useRouter();
  const { storeId } = router.query;

  useAuthGate(currentUser, router);

  useEffect(() => {
    if (storeId && currentUser) {
      getStoreInfo();
    }
  }, [storeId, currentUser]);

  async function getStoreInfo() {
    const getRes = await ControllerStores.getStoreInfo(
      currentUser!.handle,
      storeId as string
    );
    if (getRes.store) {
      const { store } = getRes;
      setInitialStore(store);
    }
  }

  if (!initialStore) return null;
  return (
    <ChangeStoreRepage
      metaTitle='Edit VendSpace Store'
      headerTitle='edit store'
      pageTitle='Edit Store'
      edit={true}
      initialStore={initialStore}
    />
  );
}
