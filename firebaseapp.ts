import { initializeApp } from 'firebase/app';
import { connectFirestoreEmulator, getFirestore } from 'firebase/firestore';
import {
  getAuth,
  connectAuthEmulator,
  GoogleAuthProvider,
} from 'firebase/auth';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBwQTinRxANZFd439xJO5whKstClqm2Vmc',
  authDomain: 'vendspace-e5f10.firebaseapp.com',
  projectId: 'vendspace-e5f10',
  storageBucket: 'vendspace-e5f10.appspot.com',
  messagingSenderId: '472944430331',
  appId: '1:472944430331:web:5519ac28550497b10c345e',
};

initializeApp(firebaseConfig);
export const firebaseAuth = getAuth();
export const firebaseStorage = getStorage();
export const firestoreDB = getFirestore();
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account',
});

let testing = true;
if (testing) {
  connectAuthEmulator(firebaseAuth, 'http://10.0.0.95:9099');
  connectStorageEmulator(firebaseStorage, '10.0.0.95', 9199);
  connectFirestoreEmulator(firestoreDB, '10.0.0.95', 8080);
}
