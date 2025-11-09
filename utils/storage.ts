// A unified storage utility that uses localStorage if available,
// otherwise falls back to a non-persistent in-memory store.
// This is critical for environments like Vercel or browsers in private mode
// where localStorage access might be restricted, preventing runtime DOMException errors.

const isLocalStorageAvailable = (): boolean => {
  try {
    const testKey = 'zenvibe_storage_test';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    // This catch block handles potential DOMException when localStorage is disabled.
    return false;
  }
};

interface AppStorage {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

let storageImplementation: AppStorage;

if (isLocalStorageAvailable()) {
  // Use localStorage, but wrap each call in a try/catch as an extra safeguard.
  // This handles edge cases like the storage quota being exceeded.
  storageImplementation = {
    get: (key) => {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        console.error(`Failed to get item '${key}' from localStorage.`, e);
        return null;
      }
    },
    set: (key, value) => {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        console.error(`Failed to set item '${key}' in localStorage.`, e);
      }
    },
    remove: (key) => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.error(`Failed to remove item '${key}' from localStorage.`, e);
      }
    },
  };
} else {
  // Fallback to a simple in-memory object if localStorage is not available.
  console.warn('localStorage is not available. App state will not be persisted across page reloads.');
  const inMemoryStore: Record<string, string> = {};
  storageImplementation = {
    get: (key) => inMemoryStore[key] || null,
    set: (key, value) => { inMemoryStore[key] = value; },
    remove: (key) => { delete inMemoryStore[key]; },
  };
}

export const storage = storageImplementation;