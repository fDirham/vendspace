import { firestoreDB } from 'firebaseapp';
import { FirebaseError } from 'firebase/app';
import {
  collection,
  deleteField,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from 'firebase/firestore';
import { ADMIN_CLAIM_HANDLE } from 'utilities/constants';

export default class ControllerClaim {
  static async useCodeForStore(code: string) {
    try {
      const usersColRef = collection(firestoreDB, 'users');
      const userDocRef = doc(usersColRef, ADMIN_CLAIM_HANDLE);
      const storesColRef = collection(userDocRef, 'stores');
      const q = query(storesColRef, where('claimId', '==', code));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty) return { isError: false, storeId: '' };
      const storeId = querySnapshot.docs[0].id;

      return { isError: false, storeId };
    } catch (err) {
      return { isError: true, data: err as FirebaseError };
    }
  }

  static async claimStore(handle: string, code: string) {
    try {
      const usersColRef = collection(firestoreDB, 'users');
      const adminDocRef = doc(usersColRef, ADMIN_CLAIM_HANDLE);
      const adminStoresColRef = collection(adminDocRef, 'stores');
      const q = query(adminStoresColRef, where('claimId', '==', code));
      const querySnapshot = await getDocs(q);
      if (querySnapshot.empty)
        return { isError: true, data: 'Code is invalid.' };

      // Add store and all of its items to new user's stores
      // Add store to user
      const storeDocSnapshot = querySnapshot.docs[0];
      const storeDoc = storeDocSnapshot.data();
      delete storeDoc.claimId;
      delete storeDoc.claimPersonName;

      const userDocRef = doc(usersColRef, handle);
      const userStoresColRef = collection(userDocRef, 'stores');
      const newStoreDocRef = doc(userStoresColRef, storeDocSnapshot.id);

      setDoc(newStoreDocRef, storeDoc);

      // Add items to user
      const storeDocRef = storeDocSnapshot.ref;
      const adminItemsColRef = collection(storeDocRef, 'items');
      const adminItems = await getDocs(adminItemsColRef);

      const userItemsColRef = collection(newStoreDocRef, 'items');
      if (!adminItems.empty) {
        await Promise.all(
          adminItems.docs.map(async (item) => {
            const newItemDocRef = doc(userItemsColRef, item.id);
            await setDoc(newItemDocRef, item.data());
          })
        );
      }

      // Remove claimId from our own thing
      await updateDoc(storeDocRef, {
        claimId: deleteField(),
        claimPersonName: deleteField(),
      });

      return { isError: false };
    } catch (err) {
      return { isError: true, data: err as FirebaseError };
    }
  }
}
