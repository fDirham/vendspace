import PageContainer from 'components/all/PageContainer';
import StyledButton from 'components/all/StyledButton';
import StyledInput from 'components/all/StyledInput';
import ControllerAuth from 'controllers/ControllerAuth';
import useAuthGate from 'hooks/useAuthGate';
import useUserAuth from 'hooks/useUserAuth';
import { useRouter } from 'next/router';
import React, { FormEvent, useEffect, useState } from 'react';
import styles from '../NewUserPage.module.scss';
import { MAX_LENGTH_NAME } from 'utilities/constants';

export default function edituser() {
  const [displayName, setDisplayName] = useState<string>('');
  const router = useRouter();
  const currentUser = useUserAuth();
  useAuthGate(currentUser, router);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (displayName !== currentUser?.displayName) {
      // Register
      await ControllerAuth.updateUserProfile(displayName);
    }

    router.push('/');
  }

  useEffect(() => {
    if (currentUser) setDisplayName(currentUser.displayName);
  }, [currentUser]);

  if (!currentUser) return null;

  return (
    <PageContainer>
      <form className={styles.container} onSubmit={handleSubmit}>
        <div className={styles.titleContainer}>
          <h1 className={styles.title}>Edit Profile</h1>
        </div>

        <StyledInput
          placeholder='Display name'
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
