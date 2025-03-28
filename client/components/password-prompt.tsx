"use client";

import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Form } from "@heroui/form";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useContext } from "react";
import { GlobalContext } from "@/app/providers";

export const PasswordPrompt = () => {
  const { setSimPassword, requestSimPassword, setRequestSimPassword } =
    useContext(GlobalContext);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    setSimPassword(password);
  };

  const handleOpenChange = (isOpen: boolean) => {
    !isOpen && setRequestSimPassword(false);
  };

  return (
    <Modal isOpen={requestSimPassword} onOpenChange={handleOpenChange}>
      <Form onSubmit={handleSubmit}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Unlock Sim</ModalHeader>
              <ModalBody>
                <Input
                  isRequired
                  errorMessage="Password is required."
                  label="Password"
                  labelPlacement="outside"
                  name="password"
                  placeholder="Unlock your SIM"
                  type="password"
                />
              </ModalBody>
              <ModalFooter>
                <Button type="submit" color="primary">
                  Submit
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Form>
    </Modal>
  );
};
