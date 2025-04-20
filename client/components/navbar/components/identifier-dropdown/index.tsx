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
    router.push("/chat");
  };

  const handleDownloadSim = () => {
    // Convert SIM object to JSON string
    const jsonString = JSON.stringify(encryptedSim, null, 2);

    // Create a Blob and trigger download
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${encryptedSim?.identifier}-sim.json`; // File name based on identifier
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Clean up object URL
    URL.revokeObjectURL(url);
  };

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
        <DropdownItem key="contacts" onPress={handleContacts}>
          Contacts
        </DropdownItem>
        <DropdownItem key="lock_unlock_sim" onPress={handleLock} className={!!sim ? "" : "hidden"}>
          Lock Sim
        </DropdownItem>
        <DropdownItem key="unmount_sim" onPress={handleUnmountSim}>
          Unmount SIM
        </DropdownItem>
        <DropdownItem key="download_sim" onPress={handleDownloadSim}>
          Download SIM
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};
