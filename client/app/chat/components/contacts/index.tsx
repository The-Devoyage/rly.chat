"use client";

import { useSim } from "@/utils/useSim";
import { Button } from "@heroui/button";
import BoringAvatar from "boring-avatars";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const avatarColors = ["#D98324", "#443627", "#EFDCAB", "#F2F6D0"];

export const Contacts = () => {
  const { sim, loading } = useSim();
  const router = useRouter();

  useEffect(() => {
    if (!sim && !loading) {
      router.push("/sims");
    }
  }, [sim]);

  if (!sim) return null;

  if (!sim.profile.contacts.length) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center h-60">
        <BoringAvatar
          name="Boakley"
          className="w-20 h-20"
          variant="beam"
          colors={avatarColors}
        />
        No Contacts Found
        <Button color="primary" variant="bordered">
          Invite Contact
        </Button>
      </div>
    );
  }

  return (
    <div>
      {sim.profile.contacts.map((c, i) => (
        <div key={c.address}>
          <div className="flex p-2 gap-4 mb-2">
            <BoringAvatar
              name={c.name}
              className="w-10 h-10"
              variant="beam"
              colors={avatarColors}
            />
            <div className="w-full">
              <h2>{c.name}</h2>
              <span className="text-gray-400 text-sm">{i} unread</span>
            </div>
          </div>
          {i !== sim.profile.contacts.length - 1 && (
            <hr className="border border-sm border-orange-500/25 my-2" />
          )}
        </div>
      ))}
    </div>
  );
};
