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
import { useDebugValue } from 'react';
import { StoreInfo, ItemVisual } from 'utilities/types';
import { LENGTH_STORE_ID } from 'utilities/constants';
import { ItemInfo } from 'utilities/types';
import {
  getDownloadURL,
  ref,
  uploadBytes,
  StorageReference,
} from 'firebase/storage';

export default class ControllerUpload {
  static async uploadImages(
    filesToUpload: File[],
    directoryRef: StorageReference
  ) {
    try {
      /* UPLOAD */
      const downloadUrls: string[] = [];

      // TODO: Monitor progress
      await Promise.all(
        filesToUpload.map(async (file) => {
          const fileRef = ref(directoryRef, new Date().getTime().toString());
          await uploadBytes(fileRef, file);
          const url = await getDownloadURL(fileRef);
          downloadUrls.push(url);
        })
      );

      return { isError: false, downloadUrls };
    } catch (err) {
      return { isError: true, data: err as FirebaseError };
    }
  }
}
