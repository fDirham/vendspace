import PageContainer from 'components/all/PageContainer';
import StyledButton from 'components/all/StyledButton';
import StoreBlock from 'components/home/StoreBlock';
import ControllerAuth from 'controllers/ControllerAuth';
import ControllerStores from 'controllers/ControllerStores';
import useUserAuth from 'hooks/useUserAuth';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { PublicUserData, StoreInfo } from 'utilities/types';
import styles from './UserPage.module.scss';
import PageHeader from 'components/all/PageHeader';
import ModalEditStore from 'components/home/ModalEditStore';
import { GetServerSideProps } from 'next';
import { PATH_SIGN_IN } from 'utilities/pathnames';

type ServerData = {
  storeList: StoreInfo[];
  userData: PublicUserData;
};

export const getServerSideProps: GetServerSideProps<{
  data: ServerData;
}> = async (context) => {
  const { handle } = context.params!;

  const getSellerRes = await ControllerAuth.getPublicUserData(handle as string);

  const getStoresRes = await ControllerStores.getUserStores(handle as string);

  if (getStoresRes.isError || getSellerRes.isError) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      data: {
        userData: getSellerRes.userData!,
        storeList: getStoresRes.stores!,
      },
    },
  };
};

type UserPageProps = {
  data: ServerData;
};

export default function UserPage(props: UserPageProps) {
  const router = useRouter();
  const currentUser = useUserAuth();
  const [storeList, setStoreList] = useState<StoreInfo[]>(props.data.storeList);
  const [editStore, setEditStore] = useState<number>(-1);
  const { userData } = props.data;

  const isUser = userData.handle === currentUser?.handle;

  function handleLogOut() {
    ControllerAuth.signOut();
    router.push(PATH_SIGN_IN);
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
    const confirmRes = confirm('Are you sure you want to delete ' + store.name);
    if (!confirmRes) return;

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
    const toReturn = storeList.map((store, index) => {
      return (
        <StoreBlock
          storeInfo={store}
          onEdit={() => setEditStore(index)}
          onNavigate={() => {
            router.push(`/s/${userData.handle}/${store.id}`);
          }}
          key={store.id}
          isUser={isUser}
        />
      );
    });

    if (isUser) {
      toReturn.unshift(
        <StoreBlock onNavigate={handleNewStore} add key='add' isUser />
      );
    }

    return toReturn;
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>VendSpace @{userData.handle}</title>
      </Head>

      <PageContainer>
        <PageHeader title={`@${userData.handle}`} />
        <ModalEditStore
          onClose={() => setEditStore(-1)}
          onDelete={handleDeleteStore}
          onEdit={handleEditStore}
          storeInfo={editStore === -1 ? undefined : storeList[editStore]}
        />
        <div className={styles.userContainer}>
          <h1>{userData.displayName}</h1>
          <h2>@{userData.handle}</h2>
          {isUser && (
            <div className={styles.userButtonsContainer}>
              <StyledButton
                className={styles.userButtons}
                mini
                onClick={handleEditProfile}
              >
                edit info
              </StyledButton>
              <StyledButton
                className={styles.userButtons}
                mini
                onClick={handleLogOut}
              >
                log out
              </StyledButton>
            </div>
          )}
        </div>
        <div className={styles.storesContainer}>{renderStoreList()}</div>
      </PageContainer>
    </div>
  );
}
