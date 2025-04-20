import { DatabaseContext } from "@/app/providers/db-provider";
import { SimContext } from "@/app/providers/sim-provider";
import { Contact } from "@/types";
import { useLiveQuery } from "dexie-react-hooks";
import { useContext } from "react";
import { decryptData } from "./encryption";

export const useContacts = () => {
  const { db } = useContext(DatabaseContext);
  const { simPassword } = useContext(SimContext);

  const contacts = useLiveQuery(async () => {
    if (!simPassword || !db) return [];

    const encryptedContacts = await db.contacts.toArray();
    const decrypted: (Contact & { unreadCount: number })[] = [];

    for (const c of encryptedContacts) {
      const contact = decryptData<Contact>(c.encryptedData, c.nonce, simPassword);
      if (contact) {
        const unreadCount = await db.message
          .where("conversation")
          .equals(contact.simUuid)
          .and((m) => m.read !== true)
          .count();

        decrypted.push({
          id: c.id,
          ...contact,
          unreadCount,
        });
      }
    }

    return decrypted;
  }, [simPassword]);

  return contacts || [];
};
