import {
  signOut,
  onAuthStateChanged,
  User,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import {
  firebaseAuth,
  googleProvider,
  firestoreDB,
  firebaseStorage,
} from 'firebaseapp';
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
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { StoreInfo, ItemVisual } from 'utilities/types';
import { LENGTH_STORE_ID } from 'utilities/constants';
import { ItemInfo } from 'utilities/types';
import { ref } from 'firebase/storage';
import ControllerUpload from './ControllerUpload';

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
        timeCreated: serverTimestamp(),
      });

      return { isError: false };
    } catch (err) {
      return { isError: true, data: err as FirebaseError };
    }
  }

  private static generateStoreId() {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
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

  static async listNewItem(
    handle: string,
    storeId: string,
    item: ItemInfo,
    deletedVisuals: boolean[]
  ) {
    // TODO: Get handle from uid
    const itemToAdd = { ...item };

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
      await addDoc(itemsColRef, itemToAdd);

      return { isError: false };
    } catch (err) {
      return { isError: true, data: err as FirebaseError };
    }
  }
}
