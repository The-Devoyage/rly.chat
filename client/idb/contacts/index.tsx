import { Contact, SimUuid } from "@/types";
import { openUserDB } from "..";
import { decryptData, encryptData } from "@/utils/encryption";

export async function insertContact(simUuid: SimUuid, contact: Contact, password: string) {
  const encryptedContact = encryptData<Contact>(contact, password);

  try {
    const db = await openUserDB(simUuid);
    await db.put("contacts", { uuid: contact.uuid, ...encryptedContact });
  } catch (err) {
    console.error(err);
    window.alert(err);
    throw new Error("Failed to insert contact.");
  }
}

export async function selectContacts(simUuid: SimUuid, password: string): Promise<Contact[]> {
  const db = await openUserDB(simUuid);
  try {
    const encryptedContacts = await db.getAll("contacts");
    const decrypted = [];
    for (const c of encryptedContacts) {
      const contact = decryptData(c.encryptedData, c.nonce, password);
      decrypted.push(contact);
    }
    return decrypted;
  } catch (err) {
    console.error(err);
    window.alert(err);
    throw new Error("Failed to select contacts.");
  }
}

export async function selectContact(
  simUuid: SimUuid,
  conversation: SimUuid,
  password: string,
): Promise<Contact> {
  const db = await openUserDB(simUuid);
  try {
    const encryptedContact = await db.get("contacts", conversation);
    const contact = decryptData(encryptedContact.encryptedData, encryptedContact.nonce, password);
    return contact;
  } catch (err) {
    console.error(err);
    window.alert(err);
    throw new Error("Failed to select contacts.");
  }
}
