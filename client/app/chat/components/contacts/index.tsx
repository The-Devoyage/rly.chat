"use client";

import { AVATAR_COLORS } from "@/utils/constants";
import { useSim } from "@/utils/useSim";
import { Button } from "@heroui/button";
import BoringAvatar from "boring-avatars";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ShareContactButton } from "../share-contact-button";

export const Contacts = () => {
  const { sim, loading } = useSim(true);
  const router = useRouter();

  useEffect(() => {
    if (!sim && !loading) {
      router.push("/sims");
    }
  }, [sim]);

  if (!sim) return null;

  if (!sim.profile.contacts.length) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center h-96">
        <BoringAvatar name="Boakley" className="w-20 h-20" variant="beam" colors={AVATAR_COLORS} />
        <p className="w-96 text-center">No One's Here - Share your contact information to get started.</p>
        <ShareContactButton variant="bordered" />
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
              colors={AVATAR_COLORS}
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
