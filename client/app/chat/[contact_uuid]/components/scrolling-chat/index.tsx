"use client";
import { FC, useContext, useEffect, useRef, useState } from "react";
import { Textarea } from "@heroui/input";
import { ScrollShadow } from "@heroui/scroll-shadow";
import clsx from "clsx";
import { GlobalContext } from "@/app/providers";
import { EncryptedMessage, SimUuid } from "@/types";
import { useSim } from "@/utils/useSim";
import { Button } from "@heroui/button";
import { ChatMessage } from "./components";
import { encryptMessage } from "@/utils/encryption";
import { insertMessage } from "@/idb/message";

export const ScrollingChat: FC<{ simUuid: SimUuid }> = ({ simUuid }) => {
  const messageRef = useRef<HTMLDivElement>(null);
  const { getMessages, sendJsonMessage } = useContext(GlobalContext);
  const messages = getMessages("ABCDEF"); //TODO: FIx this
  const { sim, identifier, contacts } = useSim(true, true);
  const chattingWith = contacts?.find((c) => c.uuid === simUuid);
  const [message, setMessage] = useState("");
  const [maxRows, setMaxRows] = useState<number | undefined>(1);

  useEffect(() => {
    if (messageRef.current) {
      messageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleSendMessage = async () => {
    if (!sim || !chattingWith) return;

    const recipientText = encryptMessage(chattingWith.publicKey, sim.profile.secretKey, message);
    const senderText = encryptMessage(sim.profile.publicKey, sim.profile.secretKey, message);

    const send: EncryptedMessage = {
      conversation: sim.uuid,
      ...recipientText,
    };

    const store: EncryptedMessage = {
      conversation: chattingWith.uuid,
      ...senderText,
    };

    await insertMessage(sim.uuid, store);

    sendJsonMessage(send);
  };

  if (!chattingWith || !identifier) return null;

  return (
    <ScrollShadow
      hideScrollBar
      className="relative justify-end overflow-y-auto"
      visibility="top"
      isEnabled={messages.length > 4}
    >
      {!messages.length && (
        <ChatMessage
          isSender
          senderIdentifier="rly.chat"
          text={`No messages found. Say hello to ${chattingWith.name}!`}
        />
      )}
      {messages.map((m, index) => (
        <ChatMessage
          isSender={simUuid === m.from}
          senderIdentifier={simUuid === m.from ? chattingWith.name! : identifier}
          text={m.text}
          ref={index === messages.length - 1 ? messageRef : undefined}
        />
      ))}
      <div
        className={clsx(
          "flex gap-1 items-end mt-2 sticky -bottom-0.5 dark:bg-zinc-800 rounded p-2",
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
            e.preventDefault();
            if (e.key === "Enter" && !e.shiftKey) {
              handleSendMessage();
              setMessage("");
              setMaxRows(1);
            }
          }}
        />
        <Button color="primary" onPress={handleSendMessage}>
          Send
        </Button>
      </div>
    </ScrollShadow>
  );
};
