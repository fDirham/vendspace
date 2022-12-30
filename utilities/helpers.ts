import { Timestamp } from 'firebase/firestore';

export function generateRandomID(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function generateUniqueFileName(file: File) {
  const baseTime = new Date().getTime();
  const sanitizedName = file.name
    .toLowerCase()
    .replaceAll('/', '')
    .replaceAll(' ', '');
  return baseTime + sanitizedName;
}

export function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

// TODO: Fill function
export function firebaseTimestampToString(timestamp: Timestamp) {
  return '';
}

export function dataURLtoFile(dataurl: string, filename: string) {
  let arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)![1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], filename, { type: mime });
}
