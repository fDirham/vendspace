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
  location: string;
  description: string;
  id: string;
  timeCreated?: string;
  claimPersonName?: string;
};

export type ItemInfo = {
  name: string;
  description: string;
  price: string;
  originalPrice?: string;
  id: string;
  visuals: ItemVisual[];
  timeCreated?: string;
  timeBumped?: string;
  hold?: boolean;
  sold?: boolean;
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

export type ScrapedItemData = {
  name: string;
  price: string;
  imageSrcs: string[];
  url: string;
};
