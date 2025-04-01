"use client";

import { GlobalContext } from "@/app/providers";
import { insertContact } from "@/idb/contacts";
import { useSim } from "@/utils/useSim";
import { Alert } from "@heroui/alert";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { useRouter } from "next/navigation";
import { FC, useContext } from "react";

export const ImportContactForm: FC<{
  contact: { address: string; publicKey: string; identifier: string; uuid: string };
}> = ({ contact }) => {
  const { simPassword } = useContext(GlobalContext);
  const { sim } = useSim(true);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!sim || !simPassword) return
    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    await insertContact(sim.uuid, { ...contact, name }, simPassword);
    router.push("/chat");
  };

  if (sim?.profile.address === contact.address) {
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
