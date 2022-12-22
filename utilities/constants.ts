// export const testApiUrl = 'http://localhost:5001/blurbitme/us-central1/v1';
// export const deploymentApiUrl =
//   'https://us-central1-tableoh-backend.cloudfunctions.net/v1';
// export const apiUrl = testApiUrl;

export const SHARE_SITE_URL = process.env.NEXT_PUBLIC_SHARE_URL;
export const INFO_SITE_URL = process.env.NEXT_PUBLIC_INFO_URL;

// User fields
export const MAX_LENGTH_NAME = 20;
export const MAX_LENGTH_HANDLE = 12;

// Store fields
export const MAX_LENGTH_STORE_NAME = 40;
export const MAX_LENGTH_STORE_DETAIL = 40;
export const MAX_LENGTH_STORE_DESCRIPTION = 200;

// Item fields
export const MAX_LENGTH_ITEM_NAME = 40;
export const MAX_LENGTH_ITEM_DESCRIPTION = 600;
export const MAX_LENGTH_ITEM_PRICE = 20;
export const MAX_ITEM_VISUALS = 5;

// ID lengths
export const LENGTH_STORE_ID = 3;
export const LENGTH_ITEM_ID = 3;

export const ADMIN_CLAIM_HANDLE = 'dummy0';
