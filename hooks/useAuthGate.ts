import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { NextRouter } from 'next/router';
import { VSUser } from 'utilities/types';

export default function useAuthGate(
  user: null | VSUser | undefined,
  router: NextRouter
) {
  useEffect(() => {
    if (user === null) {
      router.replace('/signin');
    }
    if (!!user && !user.handle) {
      router.replace('/welcome');
    }
  }, [user]);
}
