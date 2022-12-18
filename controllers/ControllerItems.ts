import { firebaseAuth, firestoreDB, firebaseStorage } from 'firebaseapp';
import { FirebaseError } from 'firebase/app';
import {
  addDoc,
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
import { StoreInfo, ItemVisual } from 'utilities/types';
import { LENGTH_ITEM_ID, LENGTH_STORE_ID } from 'utilities/constants';
import { ItemInfo } from 'utilities/types';
import { ref } from 'firebase/storage';
import ControllerUpload from './ControllerUpload';
import { generateRandomID } from 'utilities/helpers';

export default class ControllerItems {
  /*
  NOTE: We assume all visuals in item have been uploaded and are downloadUrls
  */
  static async addNewItem(
    handle: string,
    storeId: string,
    item: ItemInfo,
    deletedVisuals: boolean[]
  ) {
    // TODO: Get handle from uid
    const itemToAdd = { ...item, timeCreated: serverTimestamp() };

    try {
      /* DELETE */
      if (deletedVisuals.length) {
        // TODO
      }

      /*UPDATE FIREBASE */
      const usersColRef = collection(firestoreDB, 'users');
      const userDocRef = doc(usersColRef, handle);
      const storesColRef = collection(userDocRef, 'stores');
      const storeDocRef = doc(storesColRef, storeId);
      const itemsColRef = collection(storeDocRef, 'items');

      // Find id that's unique
      let searching = true;
      let newId = generateRandomID(LENGTH_ITEM_ID);

      while (searching) {
        const checkRes = await getDoc(doc(itemsColRef, newId));
        if (!checkRes.exists()) {
          searching = false;
        } else {
          newId = generateRandomID(LENGTH_ITEM_ID);
        }
      }

      const itemDocRef = doc(itemsColRef, newId);

      await setDoc(itemDocRef, itemToAdd);

      return { isError: false };
    } catch (err) {
      return { isError: true, data: err as FirebaseError };
    }
  }

  static async getStoreItems(handle: string, storeId: string) {
    try {
      const usersColRef = collection(firestoreDB, 'users');
      const userDocRef = doc(usersColRef, handle);
      const storesColRef = collection(userDocRef, 'stores');
      const storesDocRef = doc(storesColRef, storeId);
      const itemsColRef = collection(storesDocRef, 'items');
      const q = query(itemsColRef, orderBy('timeCreated', 'desc'));
      const itemsDocs = await getDocs(q);
      if (itemsDocs.empty) {
        return { isError: false, items: [] };
      }

      const items = itemsDocs.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
      }) as ItemInfo[];

      return { isError: false, items };
    } catch (err) {
      return { isError: true, data: err as FirebaseError };
    }
  }

  static async getStoreItem(handle: string, storeId: string, itemId: string) {
    try {
      const usersColRef = collection(firestoreDB, 'users');
      const userDocRef = doc(usersColRef, handle);
      const storesColRef = collection(userDocRef, 'stores');
      const storesDocRef = doc(storesColRef, storeId);
      const itemsColRef = collection(storesDocRef, 'items');
      const itemDocRef = doc(itemsColRef, itemId);
      const itemDoc = await getDoc(itemDocRef);
      if (!itemDoc.exists()) {
        return { isError: true, data: 'Item not found' };
      }

      const item = { ...itemDoc.data(), id: itemDoc.id } as ItemInfo;
      return { isError: false, item };
    } catch (err) {
      return { isError: true, data: err as FirebaseError };
    }
  }
}
