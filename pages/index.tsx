import useAuthGate from 'hooks/useAuthGate';
import useUserAuth from 'hooks/useUserAuth';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const currentUser = useUserAuth();
  useAuthGate(currentUser, router);
  useEffect(() => {
    if (!!currentUser && currentUser.handle) {
      router.replace(`/s/${currentUser.handle}`);
    }
  }, [currentUser]);
}
