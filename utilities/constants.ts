export const SHARE_SITE_URL = process.env.NEXT_PUBLIC_SHARE_URL;
export const INFO_SITE_URL = process.env.NEXT_PUBLIC_INFO_URL;

// User fields
export const MAX_LENGTH_NAME = 20;
export const MIN_LENGTH_NAME = 4;
export const MAX_LENGTH_HANDLE = 12;
export const MIN_LENGTH_HANDLE = 4;
export const REGEX_HANDLE = /^[a-z0-9]{4,12}$/i;

// Store fields
export const MAX_LENGTH_STORE_NAME = 40;
export const MAX_LENGTH_STORE_DETAIL = 40;
export const MAX_LENGTH_STORE_DESCRIPTION = 200;

// Item fields
export const MAX_LENGTH_ITEM_NAME = 40;
export const MAX_LENGTH_ITEM_DESCRIPTION = 700;
export const MAX_LENGTH_ITEM_PRICE = 20;
export const MAX_ITEM_VISUALS = 5;

// ID lengths
export const LENGTH_STORE_ID = 3;
export const LENGTH_ITEM_ID = 3;

export const ADMIN_CLAIM_HANDLE = process.env.NEXT_PUBLIC_ADMIN_HANDLE;

export const DEFAULT_PREVIEW_IMG = 'https://i.imgur.com/A9mwGSq.png';
