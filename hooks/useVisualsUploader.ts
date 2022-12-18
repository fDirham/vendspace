import ControllerUpload from 'controllers/ControllerUpload';
import { useRef } from 'react';
import { UploadState, UploadStatus, VSUser } from 'utilities/types';

export default function useVisualsUploader(
  setLoadingMessage: (msg: string) => void,
  currentUser: VSUser,
  onComplete: (uploadUrls: string[]) => void
) {
  const uploadingStackRef = useRef<File[]>([]);
  function setUploadingStack(newFiles: File[]) {
    uploadingStackRef.current = newFiles;
  }

  const uploadedUrlsRef = useRef<string[]>([]);
  function setUploadedUrls(newUrls: string[]) {
    uploadedUrlsRef.current = newUrls;
  }

  async function handleUploadUpdate(state: UploadState) {
    if (state.status === UploadStatus.COMPLETE) {
      // Add to uploadedUrls
      const newUrls = [...uploadedUrlsRef.current];
      newUrls[uploadingStackRef.current.length] = state.data as string;
      setUploadedUrls(newUrls);

      // Call uploadVisual
      await new Promise((r) => setTimeout(r, 500));
      uploadVisual();
    } else if (state.status === UploadStatus.UPLOADING) {
      // Utilize this somehow
      // setLoadingMessage(state.data + '%');
    }
  }

  function uploadVisual() {
    // Take first from uploading stack
    if (!uploadingStackRef.current.length) {
      onComplete(uploadedUrlsRef.current);
      return;
    }

    const newStack = [...uploadingStackRef.current];
    const toUpload = newStack.pop()!;
    setLoadingMessage('Uploading ' + toUpload.name);
    ControllerUpload.startUploadItemImage(
      toUpload,
      currentUser!.handle,
      handleUploadUpdate
    );
    setUploadingStack(newStack);
  }

  function uploadVisuals(visualFiles: File[]) {
    setLoadingMessage('Saving item...');
    setUploadingStack(visualFiles);
    uploadVisual();
  }

  return uploadVisuals;
}
