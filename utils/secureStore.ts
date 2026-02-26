import * as SecureStore from "expo-secure-store";

export const saveToken = async (token: string) => {
  await SecureStore.setItemAsync("auth_token", token);
};

export const getToken = async () => {
  return await SecureStore.getItemAsync("auth_token");
};

export const removeToken = async () => {
  await SecureStore.deleteItemAsync("auth_token");
};

export const getStoredIds = async (key: string): Promise<number[]> => {
  const data = await SecureStore.getItemAsync(key);
  return data ? JSON.parse(data) : [];
};

export const saveStoredIds = async (key: string, ids: number[]) => {
  await SecureStore.setItemAsync(key, JSON.stringify(ids));
};

export const toggleStoredId = async (key: string, id: number) => {
  const existing = await getStoredIds(key);

  let updated;
  if (existing.includes(id)) {
    updated = existing.filter((i) => i !== id);
  } else {
    updated = [...existing, id];
  }

  await saveStoredIds(key, updated);
  return updated;
};
