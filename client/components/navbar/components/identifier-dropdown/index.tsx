"use client";

import { GlobalContext } from "@/app/providers";
import { useSim } from "@/utils/useSim";
import { Chip } from "@heroui/chip";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { useRouter } from "next/navigation";
import { useContext } from "react";

export const IdentifierDropdown = () => {
  const { simPassword, setSimPassword } = useContext(GlobalContext);
  const { identifier, handleLock } = useSim(false);
  const router = useRouter();

  const handleUnmountSim = () => {
    setSimPassword(null);
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
        <DropdownItem
          key="lock_unlock_sim"
          onPress={handleLock}
          className={simPassword ? "" : "hidden"}
        >
          Lock Sim
        </DropdownItem>
        <DropdownItem key="unmount_sim" onPress={handleUnmountSim}>
          Unmount SIM
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
