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
import { useContext, useEffect, useRef } from "react";
import { GlobalContext } from "@/app/providers";
import { useRouter } from "next/navigation";

export const PasswordPrompt = () => {
  const ref = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { setSimPassword, requestSimPassword, setRequestSimPassword } =
    useContext(GlobalContext);

  useEffect(() => {
    if (ref.current && requestSimPassword) {
      ref.current.focus();
    }
  }, [requestSimPassword]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    setSimPassword(password);
    setRequestSimPassword(false);
  };

  const handleCancel = () => {
    router.push("/");
    setRequestSimPassword(false);
  };

  return (
    <Modal isOpen={requestSimPassword} hideCloseButton>
      <Form onSubmit={handleSubmit}>
        <ModalContent>
          <ModalHeader>Unlock Sim</ModalHeader>
          <ModalBody>
            <Input
              isRequired
              ref={ref}
              errorMessage="Password is required."
              label="Password"
              labelPlacement="outside"
              name="password"
              placeholder="Unlock your SIM"
              type="password"
            />
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              color="danger"
              className="opacity-25 hover:opacity-100"
              onPress={handleCancel}
            >
              Cancel
            </Button>
            <Button type="submit" color="primary">
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Form>
    </Modal>
  );
};
