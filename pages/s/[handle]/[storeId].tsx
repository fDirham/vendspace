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
import Link from 'next/link';
import ModalShareSocial from 'components/all/ModalShareSocial';
import { DEFAULT_PREVIEW_IMG, SHARE_SITE_URL } from 'utilities/constants';
import Head from 'next/head';

type ServerData = {
  storeInfo: StoreInfo;
  owner: PublicUserData;
  initialItems: ItemInfo[];
};

export const getServerSideProps: GetServerSideProps<{
  data: ServerData;
}> = async (context) => {
  const { handle, storeId } = context.params!;

  context.res.setHeader(
    'Cache-Control',
    'public, s-maxage=10, stale-while-revalidate=40'
  );

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
  const [sharing, setSharing] = useState<boolean>(false);
  const shareUrl = `${SHARE_SITE_URL}/s/${owner.handle}/${storeInfo.id}`;

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

  const metaTitle = `${storeInfo.name} by ${owner.displayName}`;
  const metaDescription = storeInfo.description
    ? storeInfo.description
    : `${owner.displayName} wants you to check out ${storeInfo.name} only on VendSpace!`;
  const metaImg = initialItems.length
    ? initialItems[0].visuals.length
      ? initialItems[0].visuals[0].uri
      : DEFAULT_PREVIEW_IMG
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
        <meta name='author' content={owner.displayName} />
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
      />
      <ModalShareSocial
        url={sharing ? shareUrl : ''}
        onClose={() => setSharing(false)}
      />
      <PageHeader
        title='store'
        onBack={handleGoBack}
        onShare={() => setSharing(true)}
      />
      <div className={styles.topContainer}>
        <h1 className={styles.title}>{storeInfo.name}</h1>
        <div className={styles.ownerContainer}>
          <p className={styles.ownerInfoText}>
            by <span className={styles.ownerName}>{owner.displayName}</span>{' '}
            <Link href={`/s/${owner.handle}`} className={styles.ownerHandle}>
              @{owner.handle}
            </Link>
          </p>
          <p>{storeInfo.location}</p>
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
      <Link href='/' className={styles.ctaLink}>
        Create your own VendSpace
      </Link>
      <div className={styles.actionContainer}>
        <StyledButton onClick={() => setOpenInfo(true)}>
          {isUser ? 'store info' : 'contact seller'}
        </StyledButton>
      </div>
    </PageContainer>
  );
}
