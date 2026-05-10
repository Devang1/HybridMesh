import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system/legacy";
import * as SecureStore from "expo-secure-store";

const STORAGE_PREFIX = "meshlink_";

export async function setSecureItem(key: string, value: string) {
  await SecureStore.setItemAsync(`${STORAGE_PREFIX}${key}`, value);
}

export async function getSecureItem(key: string) {
  return SecureStore.getItemAsync(`${STORAGE_PREFIX}${key}`);
}

export async function deleteSecureItem(key: string) {
  await SecureStore.deleteItemAsync(`${STORAGE_PREFIX}${key}`);
}

export async function setJson<T>(key: string, value: T) {
  await AsyncStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
}

export async function getJson<T>(key: string, fallback: T): Promise<T> {
  const stored = await AsyncStorage.getItem(`${STORAGE_PREFIX}${key}`);
  if (!stored) return fallback;
  try {
    return JSON.parse(stored) as T;
  } catch {
    return fallback;
  }
}

export async function ensureMediaDirectory() {
  const dir = `${FileSystem.documentDirectory}meshlink-media/`;
  const info = await FileSystem.getInfoAsync(dir);
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }
  return dir;
}
