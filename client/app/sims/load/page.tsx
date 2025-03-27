"use client";

import { decryptData } from "@/utils/encryption";
import { Alert } from "@heroui/alert";
import { Button } from "@heroui/button";
import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { useRouter } from "next/navigation";

export default function LoadSimPage() {
  const router = useRouter();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const simFile = formData.get("simFile") as File;

    if (!password || !simFile) {
      console.error("Identifier and password are required.");
      return;
    }

    const reader = new FileReader();

    reader.onload = async (event) => {
      try {
        if (!event.target?.result) {
          throw new Error("Failed to read file.");
        }

        const simData = JSON.parse(event.target.result as string);

        const {
          profile: { encryptedData, nonce },
        } = simData;

        // Call decrypt function
        decryptData(encryptedData, nonce, password);

        localStorage.setItem("sim", JSON.stringify(simData));
        window.dispatchEvent(new Event("storage"));
        router.push("/chat");
      } catch (error) {
        console.error("Error decrypting SIM:", error);
        window.alert("Failed to decrypt SIM. Wrong password?");
      }
    };

    reader.readAsText(simFile);
  };

  return (
    <div className="flex gap-4 flex-col p-4 border border-sm rounded border-orange-500">
      <Alert
        color="primary"
        description="Load a SIM and start chatting."
        className="text-left"
      />
      <Form onSubmit={handleSubmit}>
        <Input
          isRequired
          errorMessage="Invulid SIM file."
          label="SIM"
          labelPlacement="outside"
          name="simFile"
          type="file"
        />
        <Input
          isRequired
          errorMessage="Password is required."
          label="Password"
          labelPlacement="outside"
          name="password"
          placeholder="Protect your SIM"
          type="password"
        />

        <Button className="w-full" type="submit" color="primary">
          Submit
        </Button>
      </Form>
    </div>
  );
}
