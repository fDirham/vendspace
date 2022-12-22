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
  FieldValue,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { useDebugValue } from 'react';
import { PublicUserData } from 'utilities/types';

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

  static async getCurrentUserData() {
    try {
      const currentUser = firebaseAuth.currentUser;
      const userData = {
        displayName: '',
        email: '',
        handle: '',
        uid: '',
      };

      if (currentUser) {
        userData.email = currentUser.email!;

        // Grab doc from firestore
        const usersColRef = collection(firestoreDB, 'users');
        const q = query(usersColRef, where('uid', '==', currentUser.uid));
        const queryRes = await getDocs(q);

        if (!queryRes.empty) {
          // Populate userdata
          const userDoc = queryRes.docs[0];
          userData.handle = userDoc.id;
          userData.uid = userDoc.get('uid');
          userData.displayName = userDoc.get('displayName');
        }
      }

      return { isError: false, userData };
    } catch (err) {
      return { isError: true, data: err as FirebaseError };
    }
  }

  static async getPublicUserData(handle: string) {
    try {
      const usersColRef = collection(firestoreDB, 'users');
      const userDocRef = doc(usersColRef, handle);
      const userDoc = await getDoc(userDocRef);
      if (!userDoc.exists()) {
        return { isError: true, data: 'No user found' };
      }
      const userData: PublicUserData = {
        handle: userDoc.id,
        displayName: userDoc.get('displayName'),
      };

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
      const userDocRef = doc(usersColRef, handle);
      await setDoc(userDocRef, {
        displayName,
        uid: currentUser.uid,
        email: currentUser.email,
        timeCreated: serverTimestamp(),
      });

      return { isError: false };
    } catch (err) {
      return { isError: true, data: err as FirebaseError };
    }
  }

  static async checkHandleAvailability(handle: string) {
    try {
      const usersColRef = collection(firestoreDB, 'users');
      const userDocRef = doc(usersColRef, handle);
      const userDoc = await getDoc(userDocRef);

      return { isError: false, available: !userDoc.exists };
    } catch (err) {
      return { isError: true, data: err as FirebaseError };
    }
  }

  static async updateUserProfile(displayName: string) {
    try {
      const currentUser = firebaseAuth.currentUser;

      if (!currentUser) return { isError: true, data: 'User not logged in' };
      // Set doc in firestore
      const usersColRef = collection(firestoreDB, 'users');
      const userDocRef = doc(usersColRef, currentUser.uid);
      await updateDoc(userDocRef, {
        displayName,
      });

      return { isError: false };
    } catch (err) {
      return { isError: true, data: err as FirebaseError };
    }
  }
}
