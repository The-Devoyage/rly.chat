import { openDB } from "idb";

export async function openUserDB(simUuid: string) {
  return openDB(`rly_${simUuid}`, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("contacts")) {
        db.createObjectStore("contacts", { keyPath: "id", autoIncrement: true }).createIndex(
          "uuidIndex",
          "uuid",
          { unique: true },
        );
      }
      if (!db.objectStoreNames.contains("message")) {
        db.createObjectStore("message", { keyPath: "id", autoIncrement: true }).createIndex(
          "conversationIndex",
          "conversation",
        );
      }
    },
  });
}
