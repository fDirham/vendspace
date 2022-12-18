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
