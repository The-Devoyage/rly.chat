"use client";

import { useSim } from "@/utils/useSim";
import { Chip } from "@heroui/chip";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { useRouter } from "next/navigation";

export const IdentifierDropdown = () => {
  const { identifier, handleLock } = useSim(false);
  const router = useRouter();

  const handleUnmountSim = () => {
    window.localStorage.removeItem("sim");
    window.dispatchEvent(new Event("storage"));
    router.push("/");
  };

  if (!identifier) {
    return null;
  }

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Chip color="default" className="cursor-pointer">
          {identifier}
        </Chip>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem key="lock_unlock_sim" onPress={handleLock}>
          Lock Sim
        </DropdownItem>
        <DropdownItem key="unmount_sim" onPress={handleUnmountSim}>
          Unmount SIM
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
