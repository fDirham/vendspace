import { firebaseAuth, firestoreDB } from 'firebaseapp';
import { FirebaseError } from 'firebase/app';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { StoreInfo } from 'utilities/types';
import { LENGTH_STORE_ID } from 'utilities/constants';
import { generateRandomID } from 'utilities/helpers';

export default class ControllerStores {
  static async createStore(
    handle: string,
    name: string,
    contact: string,
    payment: string,
    description: string
  ) {
    try {
      const currentUser = firebaseAuth.currentUser;

      if (!currentUser) return { isError: true, data: 'User not logged in' };

      //TODO: Get handle by using uid, used this for speed rn

      // Get stores created by user
      const usersColRef = collection(firestoreDB, 'users');
      const userDocRef = doc(usersColRef, handle);
      const storesColRef = collection(userDocRef, 'stores');

      // Find id that's unique
      let searching = true;
      let newId = generateRandomID(LENGTH_STORE_ID);

      while (searching) {
        const checkRes = await getDoc(doc(storesColRef, newId));
        if (!checkRes.exists()) {
          searching = false;
        } else {
          newId = generateRandomID(LENGTH_STORE_ID);
        }
      }

      await setDoc(doc(storesColRef, newId), {
        name,
        contact,
        payment,
        description,
        timeCreated: serverTimestamp(),
      });

      return { isError: false };
    } catch (err) {
      return { isError: true, data: err as FirebaseError };
    }
  }

  static async getUserStores(handle: string) {
    try {
      const currentUser = firebaseAuth.currentUser;

      if (!currentUser) return { isError: true, data: 'User not logged in' };

      // Get stores collection ref
      const usersColRef = collection(firestoreDB, 'users');
      const userDocRef = doc(usersColRef, handle);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists) return { isError: true, data: 'User not found' };

      // Get contents of collection
      const storesColRef = collection(userDocRef, 'stores');
      const q = query(storesColRef, orderBy('timeCreated', 'desc'));
      const storesDocsRef = await getDocs(q);

      const stores = storesDocsRef.docs.map((doc) => {
        return { ...doc.data(), id: doc.id } as StoreInfo;
      });

      return { isError: false, stores };
    } catch (err) {
      return { isError: true, data: err as FirebaseError };
    }
  }

  static async getStoreInfo(handle: string, storeId: string) {
    try {
      const usersColRef = collection(firestoreDB, 'users');
      const userDocRef = doc(usersColRef, handle);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists) return { isError: true, data: 'User not found' };

      // Get contents of collection
      const storesColRef = collection(userDocRef, 'stores');

      const getRes = await getDoc(doc(storesColRef, storeId));
      if (!getRes.exists) return { isError: true, data: 'Store not found' };
      const store = { ...getRes.data(), id: storeId } as StoreInfo;

      return { isError: false, store };
    } catch (err) {
      return { isError: true, data: err as FirebaseError };
    }
  }

  static async updateStoreInfo(handle: string, newStoreInfo: StoreInfo) {
    try {
      // TODO: Get handle from uid

      const { id } = newStoreInfo;
      const toAdd = { ...newStoreInfo, id: null };

      const usersColRef = collection(firestoreDB, 'users');
      const userDocRef = doc(usersColRef, handle);
      const storesColRef = collection(userDocRef, 'stores');
      await updateDoc(doc(storesColRef, id), toAdd);
      return { isError: false };
    } catch (err) {
      return { isError: true, data: err as FirebaseError };
    }
  }
}
