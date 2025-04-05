"use client";

import { DatabaseContext } from "@/app/providers/db-provider";
import { SimContext } from "@/app/providers/sim-provider";
import { Contact } from "@/types";
import { encryptData } from "@/utils/encryption";
import { Alert } from "@heroui/alert";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { useRouter } from "next/navigation";
import { FC, useContext, useEffect } from "react";

export const ImportContactForm: FC<{
  contact: Contact;
}> = ({ contact }) => {
  const { simPassword, handleRequestUnlock, decryptSim } = useContext(SimContext);
  const router = useRouter();
  const sim = decryptSim();
  const { db } = useContext(DatabaseContext);

  useEffect(() => {
    if (!sim) handleRequestUnlock();
  }, [sim]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!sim || !simPassword || !db) return;
    const formData = new FormData(e.currentTarget);
    const identifier = formData.get("name") as string;
    const encryptedContact = encryptData<Contact>({ ...contact, identifier }, simPassword);
    await db.contacts.add({ simUuid: contact.simUuid, ...encryptedContact });
    router.push("/chat");
  };

  if (!!sim && sim?.profile.address === contact.address) {
    return (
      <div className="flex gap-4 flex-col p-4 border border-sm rounded border-orange-500">
        <Alert
          color="danger"
          description="You can not add yourself as a contact."
          className="text-left"
        />
        <Button as="a" href="/chat" color="primary" variant="bordered">
          Back to Chat
        </Button>
      </div>
    );
  }

  if (!sim) return null;

  return (
    <div className="flex gap-4 flex-col p-4 border border-sm rounded border-orange-500">
      <Alert
        color="primary"
        description="Glad to see you. Confirm the addition of the following contact to your address book."
        className="text-left"
      />
      <Form onSubmit={handleSubmit}>
        <Input
          isRequired
          errorMessage="Enter valid SIM identifier."
          label="Name"
          labelPlacement="outside"
          name="name"
          placeholder="Contact Name"
          type="text"
          defaultValue={contact.identifier}
        />
        <Button className="w-full" type="submit" color="primary">
          Submit
        </Button>
      </Form>
    </div>
  );
};
