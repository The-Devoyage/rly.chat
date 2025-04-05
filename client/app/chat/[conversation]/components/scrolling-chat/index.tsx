"use client";

import { FC, useCallback, useContext, useEffect, useRef } from "react";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { Contact, Message, SimUuid } from "@/types";
import { ChatInput, ChatMessage } from "./components";
import { SimContext } from "@/app/providers/sim-provider";
import { DatabaseContext } from "@/app/providers/db-provider";
import { useLiveQuery } from "dexie-react-hooks";
import { decryptData, decryptMessage } from "@/utils/encryption";
import { SocketContext } from "@/app/providers/socket-provider";

export const ScrollingChat: FC<{ conversation: SimUuid }> = ({ conversation }) => {
  const messageRef = useRef<HTMLDivElement>(null);
  const chatContainer = useRef<HTMLDivElement>(null);
  const { db } = useContext(DatabaseContext);
  const { handleRequestUnlock, decryptSim, simPassword } = useContext(SimContext);
  const { watchMessages } = useContext(SocketContext);
  const sim = decryptSim();
  const incoming = watchMessages(conversation);

  const contact = useLiveQuery(async () => {
    try {
      const encryptedContact = await db?.contacts.where("simUuid").equals(conversation).first();
      console.log("ENCRYPTED CONTACT");
      if (encryptedContact && simPassword) {
        const c = decryptData<Contact>(
          encryptedContact.encryptedData,
          encryptedContact.nonce,
          simPassword,
        );
        console.log(c);
        return c;
      }
      return null;
    } catch (err) {
      console.error("Failed to get contact.");
      return null;
    }
  }, [simPassword]);

  const conversationMessages =
    useLiveQuery(async () => {
      console.log("GETTING MESSAGES");
      console.log(incoming.length, sim, contact);
      if (!sim || !contact) return [];

      const encryptedMessage =
        (await db?.message.where("conversation").equals(conversation).toArray()) || [];
      console.log("ENCRYPTED MESSAGE", encryptedMessage);

      const decryptedMessages: Message[] = [];
      for (const em of encryptedMessage) {
        const decrypted = decryptMessage(
          em.sender === sim.uuid ? sim.profile.publicKey : contact?.publicKey,
          sim.profile.secretKey,
          em.encryptedData,
          em.nonce,
        );
        if (!decrypted) return;
        decryptedMessages.push(JSON.parse(decrypted) as Message);
      }
      return decryptedMessages;
    }, [incoming.length, contact]) || [];

  useEffect(() => {
    if (!sim) handleRequestUnlock();
  }, [sim]);

  useEffect(() => {
    handleScrollBottom(true);
  }, [conversationMessages.length]);

  const handleScrollBottom = useCallback(
    (shouldScroll: boolean) => {
      setTimeout(() => {
        if (messageRef.current && chatContainer.current && shouldScroll) {
          const messageTop = messageRef.current.offsetTop;
          chatContainer.current.scrollTo({
            top: messageTop - chatContainer.current.offsetTop - 10,
            behavior: "smooth",
          });
        }
      }, 250);
    },
    [messageRef.current],
  );

  if (!contact || !sim) return null;

  return (
    <ScrollShadow
      hideScrollBar
      className="relative justify-end overflow-y-auto"
      visibility="top"
      isEnabled={conversationMessages.length > 4}
      ref={chatContainer}
    >
      {!conversationMessages.length && (
        <ChatMessage
          isSender
          senderIdentifier="rly.chat"
          text={`No messages found. Say hello to ${contact.identifier}!`}
        />
      )}
      {conversationMessages.map((m, index) => (
        <ChatMessage
          key={index}
          isSender={conversation === m.from}
          senderIdentifier={conversation === m.from ? contact.identifier! : sim.identifier}
          text={m.text}
          ref={index === conversationMessages.length - 1 ? messageRef : undefined}
        />
      ))}
      <ChatInput handleScrollBottom={handleScrollBottom} contact={contact} sim={sim} />
    </ScrollShadow>
  );
};
