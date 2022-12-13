import ControllerAuth from 'controllers/ControllerAuth';
import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { VSUser } from 'utilities/types';

export default function useUserAuth() {
  const [user, setUser] = useState<null | VSUser | undefined>();
  useEffect(() => {
    ControllerAuth.authObserver(retrieveUser);
  }, []);

  async function retrieveUser(newUser: null | User | undefined) {
    console.log(newUser);
    if (!!newUser) {
      const userDataRes = await ControllerAuth.retrieveCurrentUserData();
      if (userDataRes.userData) {
        const { userData } = userDataRes;
        const vsUserObj = {
          displayName: userData.displayName,
          handle: userData.handle,
          email: userData.email,
          uid: userData.uid,
        };
        setUser(vsUserObj);
      } else setUser(null);
    }
    if (newUser === null) setUser(null);
    if (newUser === undefined) setUser(undefined);
  }

  return user;
}
