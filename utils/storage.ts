// A simple wrapper around localStorage to handle potential DOMExceptions
// when localStorage is disabled or unavailable.

export const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = 'zenvibe_storage_test';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

export const safeLocalStorageGet = (key: string): string | null => {
  try {
    return localStorage.getItem(key);
  } catch (e) {
    console.error(`Failed to read from localStorage: ${key}`, e);
    return null;
  }
};

export const safeLocalStorageSet = (key: string, value: string): void => {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    console.error(`Failed to write to localStorage: ${key}`, e);
  }
};

export const safeLocalStorageRemove = (key: string): void => {
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.error(`Failed to remove from localStorage: ${key}`, e);
  }
};
