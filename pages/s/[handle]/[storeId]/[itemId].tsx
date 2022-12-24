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
import { DEFAULT_PREVIEW_IMG, SHARE_SITE_URL } from 'utilities/constants';
import ModalShareSocial from 'components/all/ModalShareSocial';
import Head from 'next/head';

type ServerData = {
  itemInfo: ItemInfo;
  storeInfo: StoreInfo;
  sellerData: PublicUserData;
};

export const getServerSideProps: GetServerSideProps<{
  data: ServerData;
}> = async (context) => {
  const { handle, storeId, itemId } = context.params!;
  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=40'
  );

  const getSellerRes = await ControllerAuth.getPublicUserData(handle as string);

  const getStoreRes = await ControllerStores.getStoreInfo(
    handle as string,
    storeId as string
  );

  const getItemRes = await ControllerItems.getItem(
    handle as string,
    storeId as string,
    itemId as string
  );

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

  const metaTitle = `Buy ${itemInfo.name} from ${sellerData.displayName}`;
  const metaDescription =
    itemInfo.price +
    ' ' +
    (itemInfo.description
      ? itemInfo.description
      : `${sellerData.displayName} wants you to check out ${itemInfo.name} only on VendSpace!`);
  const metaImg = itemInfo.visuals.length
    ? itemInfo.visuals[0].uri
    : DEFAULT_PREVIEW_IMG;
  return (
    <PageContainer className={styles.container}>
      <Head>
        <title>{metaTitle}</title>
        <meta name='title' content={metaTitle} />
        <meta name='twitter:title' content={metaTitle} />
        <meta itemProp='name' content={metaTitle} />
        <meta name='og:title' content={metaTitle} />
        <meta name='description' content={metaDescription} />
        <meta name='og:description' content={metaDescription} />
        <meta itemProp='description' content={metaDescription} />
        <meta name='twitter:description' content={metaDescription} />
        <meta name='og:url' content={shareUrl} />
        <meta name='robots' content='index, follow' />
        <meta httpEquiv='Content-Type' content='text/html; charset=utf-8' />
        <meta name='author' content={sellerData.displayName} />
        <meta name='og:site_name' content='VendSpace' />
        <meta name='language' content='English' />
        <meta name='og:type' content='website' />
        <meta charSet='utf-8' />
        <meta name='image' content={metaImg} />
        <meta itemProp='image' content={metaImg} />
        <meta name='og:image' content={metaImg} />
        <meta name='twitter:image:src' content='image' />
        <meta name='twitter:card' content='summary' />
      </Head>
      <ModalContactInfo
        open={openInfo}
        onClose={() => setOpenInfo(false)}
        storeInfo={storeInfo}
        showDesc
      />
      <ModalShareSocial
        url={sharing ? shareUrl : ''}
        onClose={() => setSharing(false)}
      />
      <PageHeader
        title='item'
        onBack={handleGoBack}
        onShare={() => setSharing(true)}
        customBackIconSrc={'/icons/store.png'}
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
        <Link href='/' className={styles.ctaLink}>
          Create your own VendSpace
        </Link>
      </div>
      <div className={styles.actionContainer}>
        <StyledButton onClick={contactSeller}>contact seller</StyledButton>
      </div>
    </PageContainer>
  );
}
