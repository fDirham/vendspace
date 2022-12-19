import { Timestamp } from 'firebase/firestore';

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
  timeCreated?: Timestamp;
};

export type ItemInfo = {
  name: string;
  description: string;
  price: string;
  id: string;
  visuals: ItemVisual[];
  timeCreated?: Timestamp;
  timeBumped?: Timestamp;
};

export type ItemVisual = {
  uri: string;
  file?: File;
};

export enum UploadStatus {
  UPLOADING,
  ERROR,
  COMPLETE,
}

export type UploadState = {
  status: UploadStatus;
  data: any;
};
