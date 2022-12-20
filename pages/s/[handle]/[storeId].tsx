import PageContainer from 'components/all/PageContainer';
import ControllerAuth from 'controllers/ControllerAuth';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import styles from './StorePage.module.scss';
import useUserAuth from 'hooks/useUserAuth';
import ControllerStores from 'controllers/ControllerStores';
import { ItemInfo, PublicUserData, StoreInfo } from 'utilities/types';
import ItemBlockList from 'components/store/ItemBlockList';
import { GetServerSideProps } from 'next';
import ControllerItems from 'controllers/ControllerItems';
import StyledButton from 'components/all/StyledButton';
import ModalContactInfo from 'components/item/ModalContactInfo';
import ReactLinkify from 'react-linkify';
import PageHeader from 'components/all/PageHeader';

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
  const [openInfo, setOpenInfo] = useState<boolean>(false);
  const [editing, setEditing] = useState<boolean>(true);

  const currentUser = useUserAuth();
  const router = useRouter();
  const { handle, storeId } = router.query;
  const isUser = currentUser?.handle === (handle as string);

  function handleEditStore() {
    router.push(`/edit/store/${storeId as string}`);
  }

  function handleGoBack() {
    router.push('/');
  }

  return (
    <PageContainer className={styles.container}>
      <ModalContactInfo
        open={openInfo}
        onClose={() => setOpenInfo(false)}
        storeInfo={storeInfo}
      />
      <PageHeader title='store' onBack={handleGoBack} />
      <div className={styles.topContainer}>
        <h1 className={styles.title}>{storeInfo.name}</h1>
        <div className={styles.ownerContainer}>
          <p className={styles.ownerInfoText}>
            by <span className={styles.ownerName}>{owner.displayName}</span>{' '}
            <span className={styles.ownerHandle}>@{owner.handle}</span>
          </p>
        </div>
        {!!storeInfo.description && (
          <ReactLinkify>
            <div className={styles.descriptionContainer}>
              {storeInfo.description}
            </div>
          </ReactLinkify>
        )}
        {isUser && (
          <div className={styles.isUserContainer}>
            <StyledButton
              onClick={() => setEditing(!editing)}
              mini
              className={styles.userButton}
            >
              {editing ? 'stop editing items' : 'edit items'}
            </StyledButton>
            <StyledButton
              onClick={handleEditStore}
              mini
              className={styles.userButton}
            >
              edit store
            </StyledButton>
          </div>
        )}
      </div>
      <ItemBlockList
        handle={handle as string}
        storeId={storeId as string}
        isUser={isUser}
        editing={editing && isUser}
        initialItems={initialItems}
        router={router}
      />
      <div className={styles.actionContainer}>
        <StyledButton onClick={() => setOpenInfo(true)}>
          contact store
        </StyledButton>
      </div>
    </PageContainer>
  );
}
