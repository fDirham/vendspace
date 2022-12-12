import {
  signOut,
  onAuthStateChanged,
  User,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { firebaseAuth, googleProvider, firestoreDB } from 'firebaseapp';
import { FirebaseError } from 'firebase/app';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { useDebugValue } from 'react';

export default class ControllerAuth {
  static authObserver(onChange: (user: User | null) => void) {
    return onAuthStateChanged(firebaseAuth, onChange);
  }

  static async signInGoogle() {
    try {
      const signInRes = await signInWithPopup(firebaseAuth, googleProvider);
      // const credential = GoogleAuthProvider.credentialFromResult(signInRes);
      const user = signInRes.user;

      return { isError: false, user };
    } catch (err) {
      return { isError: true, data: err as FirebaseError };
    }
  }

  static async signOut() {
    try {
      await signOut(firebaseAuth);
      return { isError: false };
    } catch (err) {
      return { isError: true, data: err as FirebaseError };
    }
  }

  static async retrieveCurrentUserData() {
    try {
      const currentUser = firebaseAuth.currentUser;
      const userData = {
        displayName: '',
        email: '',
        handle: '',
      };

      if (currentUser) {
        userData.email = currentUser.email!;

        // Grab doc from firestore
        const usersColRef = collection(firestoreDB, 'users');
        const userDocRef = doc(usersColRef, currentUser.uid);
        const userRes = await getDoc(userDocRef);

        if (userRes.exists()) {
          // Populate userdata
          const userDoc = userRes.data();
          userData.displayName = userDoc.displayName;
          userData.handle = userDoc.displayName;
        } else {
          // Create doc
          await setDoc(userDocRef, {
            displayName: '',
            handle: '',
            email: currentUser.email,
          });
        }
      }

      return { isError: false, userData };
    } catch (err) {
      return { isError: true, data: err as FirebaseError };
    }
  }

  static async registerNewUserData(handle: string, displayName: string) {
    try {
      const currentUser = firebaseAuth.currentUser;

      if (!currentUser) return { isError: true, data: 'User not logged in' };
      // Set doc in firestore
      const usersColRef = collection(firestoreDB, 'users');
      const userDocRef = doc(usersColRef, currentUser.uid);
      await updateDoc(userDocRef, {
        handle,
        displayName,
      });

      return { isError: false };
    } catch (err) {
      return { isError: true, data: err as FirebaseError };
    }
  }

  static async checkHandleAvailability(handle: string) {
    try {
      const usersColRef = collection(firestoreDB, 'users');
      const q = query(usersColRef, where('handle', '==', handle));

      const querySnapshot = await getDocs(q);

      return { isError: false, available: querySnapshot.empty };
    } catch (err) {
      return { isError: true, data: err as FirebaseError };
    }
  }
}
