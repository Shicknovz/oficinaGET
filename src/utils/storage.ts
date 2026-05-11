import AsyncStorage from '@react-native-async-storage/async-storage';
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

export async function readStorage<T>(key: string, fallback: T): Promise<T> {
  try {
    if (Platform.OS === 'web') {
      const storage = getStorage();
      if (!storage) {
        return fallback;
      }

      const rawValue = storage.getItem(key);
      if (!rawValue) {
        return fallback;
      }

      return JSON.parse(rawValue) as T;
    }

    const rawValue = await AsyncStorage.getItem(key);
    if (!rawValue) {
      return fallback;
    }

    return JSON.parse(rawValue) as T;
  } catch {
    return fallback;
  }
}

export async function writeStorage<T>(key: string, value: T): Promise<void> {
  try {
    const serializedValue = JSON.stringify(value);

    if (Platform.OS === 'web') {
      const storage = getStorage();
      if (!storage) {
        return;
      }

      storage.setItem(key, serializedValue);
      return;
    }

    await AsyncStorage.setItem(key, serializedValue);
  } catch {
  }
}