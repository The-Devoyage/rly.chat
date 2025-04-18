"use client";

import { createContactLink } from "@/api/createContactLink";
import { SimContext } from "@/app/providers/sim-provider";
import { Alert } from "@heroui/alert";
import { Button, ButtonProps } from "@heroui/button";
import { Input } from "@heroui/input";
import { Modal, ModalBody, ModalContent, ModalHeader } from "@heroui/modal";
import { FC, useContext, useState } from "react";
import QRCode from "react-qr-code";

interface ShareContactButtonProps extends ButtonProps {}

export const ShareContactButton: FC<ShareContactButtonProps> = ({ ...props }) => {
  const [link, setLink] = useState<string | null>(null);
  const { decryptSim, handleRequestUnlock } = useContext(SimContext);
  const sim = decryptSim();

  const handleCreate = async () => {
    if (!sim) {
      handleRequestUnlock();
      return;
    }
    const res = await createContactLink({
      simUuid: sim.uuid,
      address: sim.profile.address,
      publicKey: sim.profile.publicKey,
      identifier: sim.identifier,
    });

    if (res && res.data?.token)
      setLink(process.env.NEXT_PUBLIC_CLIENT_URL + `/import-contact?token=${res.data.token}`);
  };

  const handleCopy = () => {
    if (link) window.navigator.clipboard.writeText(link);
  };

  return (
    <>
      <Modal isOpen={!!link} onOpenChange={(open) => !open && setLink(null)}>
        <ModalContent>
          <ModalHeader>Share Contact</ModalHeader>
          <ModalBody className="flex flex-col gap-4">
            <Alert
              color="success"
              description="Share the link or QR code with your contact to allow them to import it. The link expires after 1 week."
            />
            <div className="flex justify-center w-full border-orange-500 rounded p-4 border">
              <QRCode value={link!} />
            </div>
            <div className="flex gap-1">
              <Input value={link!} />
              <Button onPress={handleCopy}>Copy</Button>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
      <Button size="sm" color="primary" onPress={handleCreate} {...props}>
        Share Contact
      </Button>
    </>
  );
};
