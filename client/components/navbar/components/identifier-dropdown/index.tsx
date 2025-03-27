"use client";

import { SimIdentifier } from "@/components/simIdentifier";
import { useGetSim } from "@/utils/useGetSim";
import { Chip } from "@heroui/chip";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { useRouter } from "next/navigation";

export const IdentifierDropdown = () => {
  const sim = useGetSim();
  const router = useRouter();

  const handleUnmountSim = () => {
    window.localStorage.removeItem("sim");
    window.dispatchEvent(new Event("storage"));
    router.push("/");
  };

  if (!sim) {
    return null;
  }

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Chip color="default">
          <SimIdentifier />
        </Chip>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem key="unmount_sim" onPress={handleUnmountSim}>
          Unmount SIM
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
