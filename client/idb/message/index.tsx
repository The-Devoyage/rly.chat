import { SimUuid, EncryptedMessage, Sim, Message } from "@/types";
import { openUserDB } from "..";
import { decryptMessage } from "@/utils/encryption";

export async function insertMessage(currentUser: SimUuid, message: EncryptedMessage) {
  try {
    const db = await openUserDB(currentUser);
    await db.put("message", message);
  } catch (err) {
    console.error(err);
    window.alert(err);
  }
}

export async function selectMessages(sim: Sim, conversation: SimUuid): Promise<Message[]> {
  try {
    const db = await openUserDB(sim.uuid);
    const encryptedMessages = await db.getAllFromIndex(
      "message",
      "conversationIndex",
      conversation,
      20,
    );
    const messages: Message[] = [];
    for (const e of encryptedMessages) {
      const decrypted = decryptMessage(
        sim.profile.publicKey,
        sim.profile.secretKey,
        e.encryptedMessage,
        e.nonce,
      );
      messages.push(JSON.parse(decrypted) as Message);
    }
    return messages;
  } catch (err) {
    console.error(err);
    window.alert(err);
    throw new Error("Failed to get messages.");
  }
}
