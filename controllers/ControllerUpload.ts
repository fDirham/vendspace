import { firebaseStorage } from 'firebaseapp';
import { UploadState, UploadStatus } from 'utilities/types';
import {
  getDownloadURL,
  ref,
  StorageReference,
  uploadBytesResumable,
} from 'firebase/storage';
import { generateUniqueFileName } from 'utilities/helpers';

export default class ControllerUpload {
  static startUploadItemImages(
    images: File[],
    handle: string,
    onUpdate: (uploadIndex: number, uploadState: UploadState) => void
  ) {
    const userStorageRef = ref(firebaseStorage, handle);
    this.startUploadFiles(images, userStorageRef, onUpdate);
  }

  static startUploadFiles(
    filesToUpload: File[],
    directoryRef: StorageReference,
    onUpdate: (uploadIndex: number, uploadState: UploadState) => void
  ) {
    filesToUpload.forEach((file, index) => {
      this.startUploadFile(file, directoryRef, (state: UploadState) =>
        onUpdate(index, state)
      );
    });
  }

  static startUploadItemImage(
    image: File,
    handle: string,
    onUpdate: (uploadState: UploadState) => void
  ) {
    const userStorageRef = ref(firebaseStorage, handle);
    this.startUploadFile(image, userStorageRef, onUpdate);
  }

  static startUploadFile(
    file: File,
    directoryRef: StorageReference,
    onUpdate: (state: UploadState) => void
  ) {
    const fileRef = ref(directoryRef, generateUniqueFileName(file));
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onUpdate({ status: UploadStatus.UPLOADING, data: progress });
      },
      (error) => {
        onUpdate({ status: UploadStatus.ERROR, data: error });
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          onUpdate({ status: UploadStatus.COMPLETE, data: downloadURL });
        });
      }
    );
  }
}
