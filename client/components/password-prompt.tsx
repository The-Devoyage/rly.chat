"use client";

import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/modal";
import { Form } from "@heroui/form";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useContext, useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SimContext } from "@/app/providers/sim-provider";

export const PasswordPrompt = () => {
  const ref = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { encryptedSim, setSimPassword, requestSimPassword, setRequestSimPassword } =
    useContext(SimContext);
  const searchQuery = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    if (requestSimPassword && !encryptedSim) {
      window.alert("Create or mount a SIM first!");
      router.push(
        `/sims?redirect_uri=${process.env.NEXT_PUBLIC_CLIENT_URL}${pathname}?${searchQuery.toString()}`,
      );
      setRequestSimPassword(false);
    }
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
              size="lg"
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
