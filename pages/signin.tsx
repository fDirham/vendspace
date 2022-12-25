import PageContainer from 'components/all/PageContainer';
import ControllerAuth from 'controllers/ControllerAuth';
import useUserAuth from 'hooks/useUserAuth';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import styles from './SignInPage.module.scss';
import Head from 'next/head';
import { PATH_WELCOME } from 'utilities/pathnames';
import PageHeader from 'components/all/PageHeader';
import { INFO_SITE_URL } from 'utilities/constants';
import Image from 'next/image';

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
        <title>Sign In to VendSpace</title>
      </Head>

      <PageHeader title={'sign in'} />

      <h1 className={styles.title}>VendSpace</h1>
      <p className={styles.subtitle}>
        We help you sell to the people you trust
      </p>
      <Image src='hero.png' alt='hero' className={styles.hero} />
      <button className={styles.googleButton} onClick={handleGoogleSignIn}>
        <img
          className={styles.googleImg}
          src='./google_button.png'
          alt='google sign in'
        />
      </button>
      <a href={INFO_SITE_URL} target='_blank' className={styles.learnText}>
        learn more
      </a>
    </PageContainer>
  );
}

export default signin;
