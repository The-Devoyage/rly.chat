import { Address, Contact } from "@/types";
import { openUserDB } from "..";
import { decryptData, encryptData } from "@/utils/encryption";

export async function insertContact(address: Address, contact: Contact, password: string) {
  const encryptedContact = encryptData<Contact>(contact, password);
  const db = await openUserDB(address);
  await db.put("contacts", encryptedContact);
}

export async function selectContacts(address: Address, password: string) {
  const db = await openUserDB(address);
  const encryptedContacts = await db.getAll("contacts");
  const decrypted = [];
  for (const c of encryptedContacts) {
    const contact = decryptData(c.encryptedData, c.nonce, password);
    decrypted.push(contact);
  }
  return decrypted;
}
