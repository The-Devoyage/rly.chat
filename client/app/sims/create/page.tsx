"use client";

import { SimContext } from "@/app/providers/sim-provider";
import { Sim } from "@/types";
import { encryptData, generateKeyPair } from "@/utils/encryption";
import { Alert } from "@heroui/alert";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useContext } from "react";
import { v4 } from "uuid";

export default function CreateSimPage() {
  const router = useRouter();
  const { setSimPassword } = useContext(SimContext);
  const searchQuery = useSearchParams();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const identifier = formData.get("identifier") as string;
    const password = formData.get("password") as string;

    if (!identifier || !password) {
      console.error("Identifier and password are required.");
      return;
    }

    setSimPassword(password);

    const keyPair = generateKeyPair();

    const rawSim: Sim = { uuid: v4(), identifier, profile: { ...keyPair, address: v4() } };
    const profile = encryptData(rawSim.profile, password);
    const protectedSim = {
      ...rawSim,
      profile,
    };

    const c = window.confirm(
      "Download your SIM and keep it in a safe place to recover your account. Rly can not recover your account for you if this is lost.",
    );

    if (c) {
      localStorage.setItem("sim", JSON.stringify(protectedSim));
      window.dispatchEvent(new Event("storage"));
      const redirectUri = searchQuery.get("redirect_uri");
      if (redirectUri) {
        return router.push(redirectUri);
      }
      router.push("/chat");
    }
  };

  return (
    <div className="flex gap-4 flex-col p-4 border border-sm rounded border-orange-500">
      <Alert
        color="primary"
        description="A SIM is a password protected file. Give it a name and a password."
        className="text-left"
      />
      <Form onSubmit={handleSubmit}>
        <Input
          isRequired
          errorMessage="Enter valid SIM identifier."
          label="Identifier"
          labelPlacement="outside"
          name="identifier"
          placeholder="My first SIM"
          type="text"
          autoComplete="off"
          size="lg"
        />
        <Input
          isRequired
          errorMessage="Password is required."
          label="Password"
          labelPlacement="outside"
          name="password"
          placeholder="Protect your SIM"
          type="password"
          autoComplete="off"
          size="lg"
        />

        <Button className="w-full" type="submit" color="primary">
          Submit
        </Button>
      </Form>
    </div>
  );
}
