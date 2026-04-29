import { Platform } from 'react-native';

function getStorage() {
  if (Platform.OS !== 'web') {
    return null;
  }

  if (typeof globalThis === 'undefined' || !('localStorage' in globalThis)) {
    return null;
  }

  return globalThis.localStorage;
}

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const storage = getStorage();
    if (!storage) {
      return fallback;
    }

    const rawValue = storage.getItem(key);
    if (!rawValue) {
      return fallback;
    }

    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T) {
  try {
    const storage = getStorage();
    if (!storage) {
      return;
    }

    storage.setItem(key, JSON.stringify(value));
  } catch {
  }
}