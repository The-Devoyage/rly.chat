"use client";

import { AVATAR_COLORS } from "@/utils/constants";
import { useSim } from "@/utils/useSim";
import BoringAvatar from "boring-avatars";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { ShareContactButton } from "../share-contact-button";
import Link from "next/link";

export const Contacts = () => {
  const { sim, loading, contacts } = useSim(true, true);
  const router = useRouter();

  useEffect(() => {
    if (!sim && !loading) {
      router.push("/sims");
    }
  }, [sim]);

  if (!sim) return null;

  if (!contacts?.length) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center h-96">
        <BoringAvatar name="Boakley" className="w-20 h-20" variant="beam" colors={AVATAR_COLORS} />
        <p className="w-96 text-center">
          No One's Here - Share your contact information to get started.
        </p>
        <ShareContactButton variant="bordered" sim={sim} />
      </div>
    );
  }

  return (
    <div>
      {contacts.map((c, i) => (
        <Link href={`/chat/${c.address}`} key={c.address}>
          <div className="hover:bg-gray-100 dark:hover:bg-slate-700 transition-all rounded">
            <div className="flex p-2 gap-4 mb-2 justify-center items-center">
              <BoringAvatar
                name={c.name}
                className="w-10 h-10"
                variant="beam"
                colors={AVATAR_COLORS}
              />
              <div className="w-full">
                <h2>{c.name}</h2>
                <span className="text-gray-500 dark:text-gray-400 text-sm">{i} unread</span>
              </div>
            </div>
            {i !== contacts.length - 1 && (
              <hr className="border border-sm border-orange-500/25 my-2" />
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};
