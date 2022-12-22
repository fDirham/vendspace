import ControllerItems from 'controllers/ControllerItems';
import React, { useState } from 'react';
import { ItemInfo, PublicUserData, StoreInfo } from 'utilities/types';
import styles from './ItemPage.module.scss';
import VisualSystem from 'components/item/VisualSystem';
import PageContainer from 'components/all/PageContainer';
import StyledButton from 'components/all/StyledButton';
import ControllerAuth from 'controllers/ControllerAuth';
import ControllerStores from 'controllers/ControllerStores';
import ModalContactInfo from 'components/item/ModalContactInfo';
import Linkify from 'react-linkify';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import PageHeader from 'components/all/PageHeader';
import { useRouter } from 'next/router';
import { SHARE_SITE_URL } from 'utilities/constants';
import ModalShareSocial from 'components/all/ModalShareSocial';

type ServerData = {
  itemInfo: ItemInfo;
  storeInfo: StoreInfo;
  sellerData: PublicUserData;
};

export const getServerSideProps: GetServerSideProps<{
  data: ServerData;
}> = async (context) => {
  const { handle, storeId, itemId } = context.params!;

  const getItemRes = await ControllerItems.getItem(
    handle as string,
    storeId as string,
    itemId as string
  );

  const getStoreRes = await ControllerStores.getStoreInfo(
    handle as string,
    storeId as string
  );

  const getSellerRes = await ControllerAuth.getPublicUserData(handle as string);

  if (getItemRes.isError || getStoreRes.isError || getSellerRes.isError) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      data: {
        itemInfo: getItemRes.item!,
        storeInfo: getStoreRes.store!,
        sellerData: getSellerRes.userData!,
      },
    },
  };
};

type ItemPageProps = {
  data: ServerData;
};

export default function itemPage(props: ItemPageProps) {
  const [openInfo, setOpenInfo] = useState<boolean>(false);
  const { itemInfo, storeInfo, sellerData } = props.data;

  const [sharing, setSharing] = useState<boolean>(false);
  const shareUrl = `${SHARE_SITE_URL}/s/${sellerData.handle}/${storeInfo.id}/${itemInfo.id}`;

  const router = useRouter();

  function contactSeller() {
    if (itemInfo.sold) {
      alert('WARNING: item is SOLD OUT and is not available.');
    } else if (itemInfo.hold) {
      alert('WARNING: item is ON HOLD and may not be available.');
    }

    setOpenInfo(true);
  }

  function handleGoBack() {
    router.push(`/s/${sellerData.handle}/${storeInfo.id}`);
  }

  return (
    <PageContainer className={styles.container}>
      <ModalContactInfo
        open={openInfo}
        onClose={() => setOpenInfo(false)}
        storeInfo={storeInfo}
      />
      <ModalShareSocial
        url={sharing ? shareUrl : ''}
        onClose={() => setSharing(false)}
      />
      <PageHeader
        title='item'
        onBack={handleGoBack}
        onShare={() => setSharing(true)}
      />
      <VisualSystem visuals={itemInfo.visuals} />
      <div className={styles.infoContainer}>
        <h1>{itemInfo.name}</h1>
        <p className={styles.whoText}>
          <Link
            href={`/s/${sellerData.handle}/${storeInfo.id}`}
            className={styles.storeName}
          >
            {storeInfo.name}
          </Link>
          {' by '}
          <Link href={`/s/${sellerData.handle}`} className={styles.sellerName}>
            {sellerData.displayName}
          </Link>
        </p>
        <p className={styles.price}>{itemInfo.price}</p>
        {(itemInfo.sold || itemInfo.hold) && (
          <p className={styles.status}>
            {itemInfo.sold ? 'SOLD OUT' : 'ON HOLD'}
          </p>
        )}
        <Linkify>
          <p className={styles.description}>{itemInfo.description}</p>
        </Linkify>
      </div>
      <div className={styles.actionContainer}>
        <StyledButton onClick={contactSeller}>contact store</StyledButton>
      </div>
    </PageContainer>
  );
}
