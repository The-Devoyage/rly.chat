"use client";

import { Button } from "@heroui/button";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export const CreateSimButton = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handlePress = () => {
    if (searchParams) {
      return router.push(`/sims/create?${searchParams.toString()}`);
    }
    router.push("/sims/create");
  };

  return (
    <Button radius="sm" onPress={handlePress} as="a">
      Create
    </Button>
  );
};
