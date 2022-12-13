import { useEffect, useState } from 'react';
import { NextRouter } from 'next/router';
import { VSUser } from 'utilities/types';
import { PATH_SIGN_IN, PATH_WELCOME } from 'utilities/pathnames';

/*
Prevents users from accessing certain pages without logging in
*/
export default function useAuthGate(
  user: null | VSUser | undefined,
  router: NextRouter
) {
  useEffect(() => {
    if (user === null) {
      router.replace(PATH_SIGN_IN);
    }
    if (!!user && !user.handle) {
      router.replace(PATH_WELCOME);
    }
  }, [user]);
}
