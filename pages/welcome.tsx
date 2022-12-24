import PageContainer from 'components/all/PageContainer';
import StyledButton from 'components/all/StyledButton';
import StyledInput from 'components/all/StyledInput';
import ControllerAuth from 'controllers/ControllerAuth';
import { useRouter } from 'next/router';
import React, { FormEvent, useEffect, useState } from 'react';
import styles from './WelcomePage.module.scss';
import {
  MAX_LENGTH_HANDLE,
  MAX_LENGTH_NAME,
  MIN_LENGTH_HANDLE,
  MIN_LENGTH_NAME,
  REGEX_HANDLE,
} from 'utilities/constants';
import useUserAuth from 'hooks/useUserAuth';
import { VSUser } from 'utilities/types';
import Head from 'next/head';
import { PATH_SIGN_IN } from 'utilities/pathnames';
import ControllerClaim from 'controllers/ControllerClaim';
import PageHeader from 'components/all/PageHeader';

function newuser() {
  const [handle, setHandle] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const router = useRouter();
  const user = useUserAuth();

  // Lock people out if already new
  useEffect(() => {
    pageLock(user);
  }, [user]);

  async function pageLock(user: VSUser | null | undefined) {
    if (user && user.handle) {
      router.replace('/');
    }
    if (user === null) router.replace(PATH_SIGN_IN);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Check handle
    if (!REGEX_HANDLE.test(handle)) {
      alert('Handle not formatted correctly.');
      return;
    }

    const handleAvailable = ControllerAuth.checkHandleAvailability(handle);
    if (!handleAvailable) {
      alert('Handle is taken, try something else');
      return;
    }

    // Register
    await ControllerAuth.registerNewUserData(handle, displayName);

    // Add store if claim present
    if (router.query.claim) {
      await ControllerClaim.claimStore(handle, router.query.claim as string);
    }

    alert('Welcome to VendSpace!');
    router.push('/');
  }

  function handleSignOut() {
    ControllerAuth.signOut();
  }

  if (user === undefined) return null;
  return (
    <PageContainer>
      <Head>
        <title>Welcome to VendSpace!</title>
      </Head>
      <PageHeader title={'onboarding'} />

      <form className={styles.container} onSubmit={handleSubmit}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Welcome!</h1>
          <p className={styles.subtitle}>
            Create your profile before you can start selling on VendSpace
          </p>
        </div>

        <StyledInput
          placeholder='Handle*'
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          className={styles.styledInput}
          required
          maxLength={MAX_LENGTH_HANDLE}
          minLength={MIN_LENGTH_HANDLE}
        />
        <p className={styles.explainP}>
          A handle is unique to your VendSpace and cannot be changed later. Can
          only contain alphanumeric characters.
        </p>

        <StyledInput
          placeholder='Display name*'
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className={styles.styledInput}
          required
          maxLength={MAX_LENGTH_NAME}
          minLength={MIN_LENGTH_NAME}
        />
        <p className={styles.explainP}>
          Your display name is the name others first see.
        </p>
        <StyledButton type='submit'>submit</StyledButton>
        <StyledButton
          type='button'
          onClick={handleSignOut}
          className={styles.button}
        >
          go back
        </StyledButton>
      </form>
    </PageContainer>
  );
}

export default newuser;
