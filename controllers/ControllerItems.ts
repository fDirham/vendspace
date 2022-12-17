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
  static async addNewItem(
    handle: string,
    storeId: string,
    item: ItemInfo,
    deletedVisuals: boolean[]
  ) {
    // TODO: Get handle from uid
    const itemToAdd = { ...item, timeCreated: serverTimestamp() };

    // upload images
    const imagesToUpload = itemToAdd.visuals
      .filter((visual) => !!visual.file)
      .map((visual) => visual.file) as File[];

    try {
      /* UPLOAD */
      if (imagesToUpload.length) {
        const userStorageRef = ref(firebaseStorage, handle);
        const uploadRes = await ControllerUpload.uploadImages(
          imagesToUpload,
          userStorageRef
        );
        if (uploadRes.isError) return uploadRes;

        const downloadUrls = uploadRes.downloadUrls!;

        // Put urls where they belong
        const newVisuals: ItemVisual[] = [];
        itemToAdd.visuals.forEach((visual) => {
          if (visual.file) {
            newVisuals.push({
              uri: downloadUrls.shift()!,
            });
          } else {
            newVisuals.push(visual);
          }
        });
        itemToAdd.visuals = newVisuals;
      }

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
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists) return { isError: true, data: 'User not found' };

      // Get contents of collection
      const storesColRef = collection(userDocRef, 'stores');
      const storesDocRef = doc(storesColRef, storeId);
      const itemsColRef = collection(storesDocRef, 'items');
      const q = query(itemsColRef, orderBy('timeCreated', 'desc'));
      const itemsDocs = await getDocs(q);
      if (itemsDocs.empty) {
        return { isError: false, items: [] };
      }

      const items = itemsDocs.docs.map((doc) => doc.data()) as ItemInfo[];

      return { isError: false, items };
    } catch (err) {
      return { isError: true, data: err as FirebaseError };
    }
  }
}
