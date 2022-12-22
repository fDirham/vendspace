import PageContainer from 'components/all/PageContainer';
import ControllerAuth from 'controllers/ControllerAuth';
import useUserAuth from 'hooks/useUserAuth';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import styles from './SignInPage.module.scss';
import Head from 'next/head';
import { PATH_WELCOME } from 'utilities/pathnames';

function signin() {
  const router = useRouter();
  const currentUser = useUserAuth();

  useEffect(() => {
    if (router.query.claim && !!currentUser) {
      if (currentUser.handle) {
        alert('You can only claim a store if you have never signed up.');
        router.replace('/');
      } else router.replace(PATH_WELCOME + '?claim=' + router.query.claim);
    } else if (!!currentUser) {
      router.replace('/');
    }
  }, [currentUser]);

  function handleGoogleSignIn() {
    ControllerAuth.signInGoogle();
  }

  return (
    <PageContainer className={styles.container}>
      <Head>
        <title>VendSpace Sign In</title>
      </Head>
      <div className={styles.contentContainer}>
        <h1 className={styles.title}>VendSpace</h1>
        <button className={styles.googleButton} onClick={handleGoogleSignIn}>
          <img
            className={styles.googleImg}
            src='./google_button.png'
            alt='google sign in'
          />
        </button>
      </div>
    </PageContainer>
  );
}

export default signin;
