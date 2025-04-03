"use client";

import { Button } from "@heroui/button";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export const MountSimButton = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handlePress = () => {
    if (searchParams) {
      return router.push(`/sims/mount?${searchParams.toString()}`);
    }
    router.push("/sims/mount");
  };

  return (
    <Button radius="sm" onPress={handlePress} as="a">
      Mount
    </Button>
  );
};
