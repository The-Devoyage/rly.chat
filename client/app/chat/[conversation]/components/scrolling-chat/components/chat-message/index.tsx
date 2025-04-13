"use client";

import { AVATAR_COLORS } from "@/utils/constants";
import { toDate } from "@/utils/dates";
import { Card } from "@heroui/card";
import Avatar from "boring-avatars";
import clsx from "clsx";
import dayjs from "dayjs";
import { forwardRef } from "react";

export const ChatMessage = forwardRef<
  HTMLDivElement,
  { isSender: boolean; senderIdentifier: string; text: string }
>(({ isSender, senderIdentifier, text }, ref) => {
  return (
    <Card
      className={clsx("p-4 flex flex-row gap-4 my-2 mx-4", {
        "bg-transparent shadow-none": isSender,
      })}
      style={{ maxWidth: 750 }}
      ref={ref}
    >
      <div>
        <Avatar name={senderIdentifier} variant="beam" colors={AVATAR_COLORS} className="h-8 w-8" />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex gap-2 items-center">
          <h2 className="font-bold">{senderIdentifier}</h2>
          <span className="text-xs text-gray-400">{toDate(dayjs().toISOString())}</span>
        </div>
        <p>{text}</p>
      </div>
    </Card>
  );
});

ChatMessage.displayName = "ChatMessage";
