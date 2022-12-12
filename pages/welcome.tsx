import PageContainer from 'components/all/PageContainer';
import StyledButton from 'components/all/StyledButton';
import StyledInput from 'components/all/StyledInput';
import ControllerAuth from 'controllers/ControllerAuth';
import { useRouter } from 'next/router';
import React, { FormEvent, useEffect, useState } from 'react';
import styles from './NewUserPage.module.scss';
import { MAX_LENGTH_HANDLE, MAX_LENGTH_NAME } from 'utilities/constants';

function newuser() {
  const [handle, setHandle] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const router = useRouter();

  // Lock people out if already new
  useEffect(() => {
    pageLock();
  }, []);

  async function pageLock() {
    const userDataRes = await ControllerAuth.retrieveCurrentUserData();
    if (userDataRes.userData?.handle) {
      router.replace('/');
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    // Check handle
    const handleAvailable = ControllerAuth.checkHandleAvailability(handle);
    if (!handleAvailable) {
      window.alert('Handle is taken, try something else');
      return;
    }

    // Register
    await ControllerAuth.registerNewUserData(handle, displayName);

    router.push('/');
  }

  return (
    <PageContainer>
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
        />
        <p className={styles.explainP}>
          A handle is unique to your VendSpace and cannot be changed later.
        </p>

        <StyledInput
          placeholder='Display name*'
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className={styles.styledInput}
          required
          maxLength={MAX_LENGTH_NAME}
        />
        <p className={styles.explainP}>
          Your display name is the name others first see
        </p>

        <StyledButton type='submit'>submit</StyledButton>
      </form>
    </PageContainer>
  );
}

export default newuser;
