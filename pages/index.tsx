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
import PageHeader from 'components/all/PageHeader';
import ModalEditStore from 'components/home/ModalEditStore';

export default function Home() {
  const router = useRouter();
  const currentUser = useUserAuth();
  useAuthGate(currentUser, router);
  const [storeList, setStoreList] = useState<StoreInfo[]>([]);
  const [editStore, setEditStore] = useState<number>(-1);

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
      alert('Too many stores, delete to continue.');
      return;
    }
    router.push('/create');
  }

  async function handleDeleteStore() {
    const store = storeList[editStore];
    const deleteRes = await ControllerStores.deleteStore(
      currentUser!.handle,
      store.id
    );
    if (deleteRes.isError) return; // TODO: Handle error
    const newStores = [...storeList];
    newStores.splice(editStore, 1);
    setStoreList(newStores);
    setEditStore(-1);
  }

  function handleEditStore() {
    const store = storeList[editStore];
    router.push(`/edit/store/${store.id}`);
  }

  const renderStoreList = () => {
    if (!storeList.length) return;
    return storeList.map((store, index) => {
      return (
        <StoreBlock
          storeInfo={store}
          onEdit={() => setEditStore(index)}
          onNavigate={() => {
            router.push(`/s/${currentUser!.handle}/${store.id}`);
          }}
          key={store.id}
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
        <PageHeader title={'Home'} />
        <ModalEditStore
          onClose={() => setEditStore(-1)}
          onDelete={handleDeleteStore}
          onEdit={handleEditStore}
          storeInfo={editStore === -1 ? undefined : storeList[editStore]}
        />
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
