"use client";

import { Sim } from "@/types";
import { encryptData, generateKeyPair } from "@/utils/encryption";
import { Alert } from "@heroui/alert";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { useRouter } from "next/navigation";

export default function CreateSimPage() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const identifier = formData.get("identifier") as string;
    const password = formData.get("password") as string;

    if (!identifier || !password) {
      console.error("Identifier and password are required.");
      return;
    }

    const keyPair = generateKeyPair();
    const rawSim: Sim = { identifier, profile: { ...keyPair, contacts: [] } };
    const profile = encryptData(rawSim.profile, password);

    const protectedSim = {
      identifier,
      profile,
    };

    const c = window.confirm(
      "Downloading SIM... Keep this file safe. There are no accounts on RLY. If you loose this file, you will loose access to your SIM forever.",
    );

    if (c) {
      // Save to localStorage (optional)
      localStorage.setItem("sim", JSON.stringify(protectedSim));

      // Convert SIM object to JSON string
      const jsonString = JSON.stringify(protectedSim, null, 2);

      // Create a Blob and trigger download
      const blob = new Blob([jsonString], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${identifier}-sim.json`; // File name based on identifier
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Clean up object URL
      URL.revokeObjectURL(url);

      window.dispatchEvent(new Event("storage"));
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
        />

        <Button className="w-full" type="submit" color="primary">
          Submit
        </Button>
      </Form>
    </div>
  );
}
