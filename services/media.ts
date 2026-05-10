import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { MessageAttachment } from "@/types/domain";
import { ensureMediaDirectory } from "@/services/storage";
import { createId } from "@/utils/id";

export async function pickImageAttachment(): Promise<MessageAttachment | undefined> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!permission.granted) return undefined;

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    quality: 0.82,
    allowsEditing: false
  });

  if (result.canceled) return undefined;
  const asset = result.assets[0];
  const cachedUri = await cacheMedia(asset.uri);
  return {
    id: createId("att"),
    type: asset.type === "video" ? "video" : "image",
    uri: asset.uri,
    cachedUri,
    width: asset.width,
    height: asset.height,
    fileName: undefined,
    uploadProgress: 0
  } as MessageAttachment;
}

export async function pickDocumentAttachment(): Promise<MessageAttachment | undefined> {
  const result = await DocumentPicker.getDocumentAsync({ copyToCacheDirectory: true, multiple: false });
  if (result.canceled) return undefined;
  const asset = result.assets[0];
  const cachedUri = await cacheMedia(asset.uri);
  return {
    id: createId("att"),
    type: "document",
    uri: asset.uri,
    cachedUri,
    name: asset.name,
    mimeType: asset.mimeType,
    size: asset.size,
    uploadProgress: 0
  };
}

export function createLocationAttachment(latitude: number, longitude: number): MessageAttachment {
  return {
    id: createId("att"),
    type: "location",
    uri: `geo:${latitude},${longitude}`,
    name: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
    uploadProgress: 100
  };
}

export async function cacheMedia(uri: string) {
  const dir = await ensureMediaDirectory();
  const extension = uri.split(".").pop()?.split("?")[0] ?? "bin";
  const target = `${dir}${createId("media")}.${extension}`;
  try {
    await FileSystem.copyAsync({ from: uri, to: target });
    return target;
  } catch {
    return uri;
  }
}
