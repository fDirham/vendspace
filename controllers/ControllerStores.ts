import { firebaseAuth, firestoreDB } from 'firebaseapp';
import { FirebaseError } from 'firebase/app';
import {
  collection,
  deleteDoc,
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
import { firebaseTimestampToString, generateRandomID } from 'utilities/helpers';

export default class ControllerStores {
  static async createStore(
    handle: string,
    name: string,
    contact: string,
    location: string,
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
        location,
        description,
        timeCreated: serverTimestamp(),
      });

      return { isError: false, id: newId };
    } catch (err) {
      return { isError: true, data: err as FirebaseError };
    }
  }

  static async getUserStores(handle: string) {
    try {
      const usersColRef = collection(firestoreDB, 'users');
      const userDocRef = doc(usersColRef, handle);
      const storesColRef = collection(userDocRef, 'stores');
      const q = query(storesColRef, orderBy('timeCreated', 'desc'));
      const storesDocsRef = await getDocs(q);

      const stores = storesDocsRef.docs.map((storeDoc) => {
        return {
          ...storeDoc.data(),
          id: storeDoc.id,
          timeCreated: firebaseTimestampToString(storeDoc.get('timeCreated')),
        } as StoreInfo;
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
      const storesColRef = collection(userDocRef, 'stores');
      const storeDoc = await getDoc(doc(storesColRef, storeId));

      if (!storeDoc.exists()) return { isError: true, data: 'Store not found' };
      const store = {
        ...storeDoc.data(),
        id: storeId,
        timeCreated: firebaseTimestampToString(storeDoc.get('timeCreated')),
      } as StoreInfo;

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

  static async deleteStore(handle: string, storeId: string) {
    try {
      // TODO: Get handle from uid

      const usersColRef = collection(firestoreDB, 'users');
      const userDocRef = doc(usersColRef, handle);
      const storesColRef = collection(userDocRef, 'stores');
      const storeDocRef = doc(storesColRef, storeId);
      const itemsColRef = collection(storeDocRef, 'items');

      // Delete items
      const itemsSnapshot = await getDocs(itemsColRef);
      if (!itemsSnapshot.empty) {
        await Promise.all(
          itemsSnapshot.docs.map(async (item) => {
            const itemDocRef = doc(itemsColRef, item.id);
            await deleteDoc(itemDocRef);
          })
        );
      }

      // Delete doc
      await deleteDoc(storeDocRef);
      return { isError: false };
    } catch (err) {
      return { isError: true, data: err as FirebaseError };
    }
  }
}
