"use client";
import { FC, useContext, useEffect, useRef, useState } from "react";
import { Textarea } from "@heroui/input";
import { Card } from "@heroui/card";
import { ScrollShadow } from "@heroui/scroll-shadow";
import clsx from "clsx";
import Avatar from "boring-avatars";
import { AVATAR_COLORS } from "@/utils/constants";
import { toDate } from "@/utils/dates";
import dayjs from "dayjs";
import { GlobalContext } from "@/app/providers";
import { Address } from "@/types";
import { useSim } from "@/utils/useSim";
import { Button } from "@heroui/button";

export const ScrollingChat: FC<{ address: Address }> = ({ address }) => {
  const messageRef = useRef<HTMLDivElement>(null);
  const { getMessages, sendMessage } = useContext(GlobalContext);
  const messages = getMessages(address);
  const { sim, identifier, contacts } = useSim(true, true);
  const chattingWith = contacts?.find((c) => c.address === address);
  const [message, setMessage] = useState("");
  const [maxRows, setMaxRows] = useState<number | undefined>(1);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleSendMessage = () => {
    sendMessage("HEY!");
  };

  return (
    <ScrollShadow
      hideScrollBar
      className="relative justify-end overflow-y-auto"
      visibility="top"
      isEnabled={messages.length > 4}
    >
      {!messages.length && (
        <div className="flex items-center justify-center gap-8 p-8 border border-orange-500 rounded text-center h-96">
          <Avatar
            name={chattingWith?.name || "User"}
            variant="beam"
            colors={AVATAR_COLORS}
            className="h-40 w-40"
          />
          <h1 className="text-2xl">No Messages Found! Say hello to {chattingWith?.name}!</h1>
        </div>
      )}
      {messages.map((m, index) => (
        <Card
          key={index}
          className={clsx("p-4 flex flex-row gap-4 my-2", {
            "bg-transparent shadow-none": m.sender !== sim?.profile.address,
          })}
          style={{ maxWidth: 500 }}
          ref={index === messages.length - 1 ? messageRef : undefined}
        >
          <Avatar
            name={m.sender === address ? chattingWith?.name || "User" : identifier || "Me"}
            variant="beam"
            colors={AVATAR_COLORS}
            className="h-8 w-8"
          />
          <div className="flex flex-col gap-4">
            <div className="flex gap-2 items-center">
              <h2 className="font-bold">
                {m.sender === address ? chattingWith?.name || "User" : identifier || "Me"}
              </h2>
              <span className="text-xs text-gray-400">{toDate(dayjs().toISOString())}</span>
            </div>
            <p>{m.text}</p>
          </div>
        </Card>
      ))}
      <div
        className={clsx(
          "flex gap-1 items-end mt-2 sticky -bottom-0.5 bg-zinc-800 rounded p-4",
          maxRows ? "flex-row" : "flex-col",
        )}
      >
        <Textarea
          onFocusChange={(focused) => setMaxRows(focused ? undefined : 1)}
          placeholder="Your message..."
          onChange={(e) => setMessage(e.currentTarget.value)}
          value={message}
          maxRows={maxRows}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
        />
        <Button color="primary" onPress={handleSendMessage} variant="bordered">
          Send
        </Button>
      </div>
    </ScrollShadow>
  );
};
