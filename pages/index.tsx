import PageContainer from 'components/all/PageContainer';
import StyledButton from 'components/all/StyledButton';
import StoreBlock from 'components/home/StoreBlock';
import ControllerAuth from 'controllers/ControllerAuth';
import ControllerStores from 'controllers/ControllerStores';
import useAuthGate from 'hooks/useAuthGate';
import useUserAuth from 'hooks/useUserAuth';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { StoreInfo } from 'utilities/types';
import styles from './IndexPage.module.scss';

export default function Home() {
  const router = useRouter();
  const currentUser = useUserAuth();
  useAuthGate(currentUser, router);
  const [storeList, setStoreList] = useState<StoreInfo[]>([]);

  useEffect(() => {
    if (currentUser) {
      retrieveStoreList();
    }
  }, [currentUser]);

  async function retrieveStoreList() {
    const getRes = await ControllerStores.getUserStores(currentUser!.handle);
    if (getRes.stores) {
      setStoreList(getRes.stores);
    }
  }

  function handleLogOut() {
    ControllerAuth.signOut();
  }

  function handleEditProfile() {
    router.push('/edit/user');
  }

  function handleNewStore() {
    // TODO: Better lock
    if (storeList.length >= 10) {
      window.alert('Too many stores, delete to continue.');
      return;
    }
    router.push('/create');
  }

  const renderStoreList = () => {
    if (!storeList.length) return;
    return storeList.map((store) => {
      return (
        <StoreBlock
          storeInfo={store}
          onEdit={() => router.push(`/edit/store/${store.id}`)}
          onNavigate={() =>
            router.push(`/s/${currentUser!.handle}/${store.id}`)
          }
        />
      );
    });
  };

  if (!currentUser || !currentUser.handle) return null;
  return (
    <div className={styles.container}>
      <Head>
        <title>VendSpace</title>
      </Head>

      <PageContainer>
        <div className={styles.userContainer}>
          <h1>{currentUser.displayName}</h1>
          <h2>@{currentUser.handle}</h2>
          <div className={styles.userButtonsContainer}>
            <StyledButton
              className={styles.userButtons}
              mini
              alternative
              onClick={handleEditProfile}
            >
              edit
            </StyledButton>
            <StyledButton
              className={styles.userButtons}
              mini
              alternative
              onClick={handleLogOut}
            >
              log out
            </StyledButton>
          </div>
        </div>
        <div className={styles.storesContainer}>
          <StyledButton
            onClick={handleNewStore}
            className={styles.newStoreButton}
          >
            new store
          </StyledButton>
          {renderStoreList()}
        </div>
      </PageContainer>
    </div>
  );
}
