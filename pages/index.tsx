import PageContainer from 'components/all/PageContainer';
import ControllerAuth from 'controllers/ControllerAuth';
import useAuthGate from 'hooks/useAuthGate';
import useUserAuth from 'hooks/useUserAuth';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import styles from './HomePage.module.scss';

export default function Home() {
  const router = useRouter();
  const currentUser = useUserAuth();
  useAuthGate(currentUser, router);

  function handleLogOut() {
    ControllerAuth.signOut();
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>VendSpace</title>
      </Head>

      <PageContainer>
        <button onClick={handleLogOut}>Log out</button>
      </PageContainer>
    </div>
  );
}
