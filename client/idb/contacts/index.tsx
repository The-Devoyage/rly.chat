import { Address, Contact } from "@/types";
import { openUserDB } from "..";
import { decryptData, encryptData } from "@/utils/encryption";

export async function insertContact(address: Address, contact: Contact, password: string) {
  const encryptedContact = encryptData<Contact>(contact, password);

  try {
    const db = await openUserDB(address);

    //Verify encrypted contacts are unique
    const contacts = await selectContacts(address, password);

    console.log(contacts, address)

    if (contacts.findIndex((c) => c.address === contact.address) >= 0) {
      throw new Error("Contact already exists.");
    }

    await db.put("contacts", encryptedContact);
  } catch (err) {
    console.error(err);
    window.alert(err);
  }
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
