"use client";

import { SimContext } from "@/app/providers/sim-provider";
import { Chip } from "@heroui/chip";
import { Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/dropdown";
import { useRouter } from "next/navigation";
import { useContext } from "react";

export const IdentifierDropdown = () => {
  const { encryptedSim, handleLock, decryptSim } = useContext(SimContext);
  const router = useRouter();
  const sim = decryptSim();

  const handleUnmountSim = () => {
    handleLock();
    window.localStorage.removeItem("sim");
    window.dispatchEvent(new Event("storage"));
    router.push("/");
  };

  const handleContacts = () => {
    router.push("/chat")
  }

  if (!encryptedSim) {
    return null;
  }

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Chip color="default" className="cursor-pointer">
          {encryptedSim.identifier}
        </Chip>
      </DropdownTrigger>
      <DropdownMenu>
        <DropdownItem key="contacts" onPress={handleContacts} className={!!encryptedSim ? "" : "hidden"}>Contacts</DropdownItem>
        <DropdownItem key="lock_unlock_sim" onPress={handleLock} className={!!sim ? "" : "hidden"}>
          Lock Sim
        </DropdownItem>
        <DropdownItem key="unmount_sim" onPress={handleUnmountSim}>
          Unmount SIM
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
