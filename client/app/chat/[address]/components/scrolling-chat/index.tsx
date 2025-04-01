"use client";
import { FC, useContext, useEffect, useRef, useState } from "react";
import { Textarea } from "@heroui/input";
import { ScrollShadow } from "@heroui/scroll-shadow";
import clsx from "clsx";
import Avatar from "boring-avatars";
import { AVATAR_COLORS } from "@/utils/constants";
import { GlobalContext } from "@/app/providers";
import { Address, Message } from "@/types";
import { useSim } from "@/utils/useSim";
import { Button } from "@heroui/button";
import nacl from "tweetnacl";
import naclUtil from "tweetnacl-util";
import { ChatMessage } from "./components";

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

  function encryptMessage(recipientPublicKey: string, senderSecretKey: string) {
    const messageUint8 = naclUtil.decodeUTF8(message);
    const nonce = nacl.randomBytes(nacl.box.nonceLength);

    console.log(recipientPublicKey);

    const publicKey = naclUtil.decodeBase64(recipientPublicKey);
    const privateKey = naclUtil.decodeBase64(senderSecretKey);

    // Encrypt using sender's private key and recipient's public key
    const encryptedMessage = nacl.box(messageUint8, nonce, publicKey, privateKey);

    return {
      encryptedMessage: naclUtil.encodeBase64(encryptedMessage),
      nonce: naclUtil.encodeBase64(nonce),
    };
  }

  const handleSendMessage = () => {
    if (!sim || !chattingWith) return;

    const recipientText = encryptMessage(chattingWith.publicKey, sim.profile.secretKey);
    const senderText = encryptMessage(sim.profile.publicKey, sim.profile.secretKey);

    const recipientMessage: Message = {
      sender: sim.profile.address,
      receiver: chattingWith.address,
      text: JSON.stringify(recipientText),
    };

    const senderMessage: Message = {
      sender: sim.profile.address,
      receiver: sim.profile.address,
      text: JSON.stringify(senderText),
    };

    sendMessage("HEY!");
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
          isSender={address === m.sender}
          senderIdentifier={m.sender === address ? chattingWith.name! : identifier}
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
