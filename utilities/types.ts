import { User as FirebaseUser } from 'firebase/auth';

export type VSUser = {
  firebaseUser: FirebaseUser;
  displayName: string;
  handle: string;
  email: string;
};

export type StoreInfo = {
  name: string;
  contact: string;
  payment: string;
  description: string;
  id: string;
};
