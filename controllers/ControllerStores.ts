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
  addDoc,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  FieldValue,
  Firestore,
  getDoc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { useDebugValue } from 'react';
import { StoreInfo } from 'utilities/types';
import { LENGTH_STORE_ID } from 'utilities/constants';

export default class ControllerStores {
  static async createStore(
    name: string,
    contact: string,
    payment: string,
    description: string
  ) {
    try {
      const currentUser = firebaseAuth.currentUser;

      if (!currentUser) return { isError: true, data: 'User not logged in' };

      // Create doc in stores collection
      const storesColRef = collection(firestoreDB, 'stores');

      // Find id that's unique
      let searching = true;
      let newId = ControllerStores.generateStoreId();

      while (searching) {
        const checkRes = await getDoc(doc(storesColRef, newId));
        if (!checkRes.exists()) {
          searching = false;
        } else {
          newId = ControllerStores.generateStoreId();
        }
      }

      await setDoc(doc(storesColRef, newId), {
        name,
        contact,
        payment,
        description,
      });

      // Update user
      const usersColRef = collection(firestoreDB, 'users');
      const userDocRef = doc(usersColRef, currentUser.uid);

      await updateDoc(userDocRef, {
        stores: arrayUnion(newId),
      });

      return { isError: false };
    } catch (err) {
      return { isError: true, data: err as FirebaseError };
    }
  }

  private static generateStoreId() {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < LENGTH_STORE_ID; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  static async getUserStores(handle: string) {
    try {
      const currentUser = firebaseAuth.currentUser;

      if (!currentUser) return { isError: true, data: 'User not logged in' };

      // Get user
      const usersColRef = collection(firestoreDB, 'users');
      const q = query(usersColRef, where('handle', '==', handle));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) return { isError: true, data: 'User not found' };

      const storeIds: string[] = await querySnapshot.docs[0].get('stores');

      const storesColRef = collection(firestoreDB, 'stores');
      const stores = await Promise.all(
        storeIds.map(async (id) => {
          const storeDocRef = doc(storesColRef, id);
          const getRes = await getDoc(storeDocRef);
          return { ...getRes.data(), id } as StoreInfo;
        })
      );

      return { isError: false, stores };
    } catch (err) {
      return { isError: true, data: err as FirebaseError };
    }
  }

  static async getStoreInfo(storeId: string) {
    try {
      const storesColRef = collection(firestoreDB, 'stores');
      const getRes = await getDoc(doc(storesColRef, storeId));
      if (!getRes.exists) return { isError: true, data: 'Store not found' };
      const store = { ...getRes.data(), id: storeId } as StoreInfo;

      return { isError: false, store };
    } catch (err) {
      return { isError: true, data: err as FirebaseError };
    }
  }

  static async updateStoreInfo(newStoreInfo: StoreInfo) {
    try {
      const { id } = newStoreInfo;
      const toAdd = { ...newStoreInfo, id: null };

      const storesColRef = collection(firestoreDB, 'stores');
      await updateDoc(doc(storesColRef, id), toAdd);
      return { isError: false };
    } catch (err) {
      return { isError: true, data: err as FirebaseError };
    }
  }
}
