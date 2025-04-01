import { openDB } from "idb";

export async function openUserDB(userUuid: string) {
  return openDB(`rly_${userUuid}`, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("contacts")) {
        db.createObjectStore("contacts", { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains("message")) {
        db.createObjectStore("message", { keyPath: "id", autoIncrement: true });
      }
    },
  });
}
