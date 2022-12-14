import { User as FirebaseUser } from 'firebase/auth';

export type VSUser = {
  displayName: string;
  handle: string;
  email: string;
  uid: string;
};

export type PublicUserData = {
  handle: string;
  displayName: string;
};

export type StoreInfo = {
  name: string;
  contact: string;
  payment: string;
  description: string;
  id: string;
};

export type ItemInfo = {
  name: string;
  description: string;
  price: string;
  id: string;
  visuals: ItemVisual[];
};

export type ItemVisual = {
  uri: string;
  file?: File;
};
