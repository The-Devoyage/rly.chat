"use client";

import { AVATAR_COLORS } from "@/utils/constants";
import BoringAvatar from "boring-avatars";
import { ShareContactButton } from "../share-contact-button";
import Link from "next/link";
import { useContext, useEffect } from "react";
import { SimContext } from "@/app/providers/sim-provider";
import { useContacts } from "@/utils/useContacts";

export const Contacts = () => {
  const contacts = useContacts();
  const { handleRequestUnlock, decryptSim } = useContext(SimContext);
  const sim = decryptSim();

  useEffect(() => {
    if (!sim) handleRequestUnlock();
  }, [sim]);

  if (!contacts?.length) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center h-96">
        <BoringAvatar name="Boakley" className="w-20 h-20" variant="beam" colors={AVATAR_COLORS} />
        <p className="w-96 text-center">
          No One&apos;s Here. Share your contact information to get started.
        </p>
        <ShareContactButton variant="bordered" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        Contacts
        <div className="flex gap-2">
          {/* <Button size="sm" color="secondary" variant="ghost"> */}
          {/*   Export */}
          {/* </Button> */}
          <ShareContactButton />
        </div>
      </div>
      {contacts.map((c, i) => (
        <Link href={`/chat/${c.simUuid}`} key={c.simUuid}>
          <div className="hover:bg-gray-100 dark:hover:bg-slate-700 transition-all rounded">
            <div className="flex p-2 gap-4 mb-2 justify-center items-center">
              <BoringAvatar
                name={c.identifier}
                className="w-10 h-10"
                variant="beam"
                colors={AVATAR_COLORS}
              />
              <div className="w-full">
                <h2>{c.identifier}</h2>
                <span className="text-gray-500 dark:text-gray-400 text-sm">{c.unreadCount} unread</span>
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
