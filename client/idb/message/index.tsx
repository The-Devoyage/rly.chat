import { Address, SimUuid, Message, EncryptedMessage } from "@/types";
import { openUserDB } from "..";

export async function insertMessage(currentUser: SimUuid, message: EncryptedMessage) {
  try {
    const db = await openUserDB(currentUser);
    await db.put("message", message);
  } catch (err) {
    console.error(err);
    window.alert(err);
  }
}

export async function selectMessages(currentUser: Address, sender: Address) {}
