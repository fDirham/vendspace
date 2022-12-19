import PageContainer from 'components/all/PageContainer';
import ControllerAuth from 'controllers/ControllerAuth';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import styles from './StorePage.module.scss';
import useUserAuth from 'hooks/useUserAuth';
import ControllerStores from 'controllers/ControllerStores';
import { ItemInfo, PublicUserData, StoreInfo } from 'utilities/types';
import InfoButtons from 'components/store/InfoButtons';
import ItemBlockList from 'components/store/ItemBlockList';
import { GetServerSideProps } from 'next';
import ControllerItems from 'controllers/ControllerItems';

type ServerData = {
  storeInfo: StoreInfo;
  owner: PublicUserData;
  initialItems: ItemInfo[];
};

export const getServerSideProps: GetServerSideProps<{
  data: ServerData;
}> = async (context) => {
  const { handle, storeId } = context.params!;

  const getStoreRes = await ControllerStores.getStoreInfo(
    handle as string,
    storeId as string
  );

  const getSellerRes = await ControllerAuth.getPublicUserData(handle as string);

  const getItemsRes = await ControllerItems.getStoreItems(
    handle as string,
    storeId as string
  );

  if (getItemsRes.isError || getStoreRes.isError || getSellerRes.isError) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      data: {
        storeInfo: getStoreRes.store!,
        owner: getSellerRes.userData!,
        initialItems: getItemsRes.items!,
      },
    },
  };
};

type StorePageProps = {
  data: ServerData;
};

export default function storepage(props: StorePageProps) {
  const { storeInfo, owner, initialItems } = props.data;

  const [editing, setEditing] = useState<boolean>(false);

  const currentUser = useUserAuth();
  const router = useRouter();
  const { handle, storeId } = router.query;
  const isUser = currentUser?.handle === (handle as string);

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
        <InfoButtons
          storeInfo={storeInfo}
          isUser={isUser}
          setEditing={setEditing}
          editing={editing}
        />
      </div>
      {!!storeInfo.description && (
        <div className={styles.descriptionContainer}>
          {storeInfo.description}
        </div>
      )}
      <ItemBlockList
        handle={handle as string}
        storeId={storeId as string}
        isUser={isUser}
        editing={editing}
        initialItems={initialItems}
        router={router}
      />
    </PageContainer>
  );
}
