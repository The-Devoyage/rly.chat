"use client";

import { FC, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { ScrollShadow } from "@heroui/scroll-shadow";
import { GlobalContext } from "@/app/providers";
import { Message, SimUuid } from "@/types";
import { useSim } from "@/utils/useSim";
import { ChatInput, ChatMessage } from "./components";
import { selectMessages } from "@/idb/message";

export const ScrollingChat: FC<{ conversation: SimUuid }> = ({ conversation }) => {
  const messageRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainer = useRef<HTMLDivElement>(null);
  const { getMessages } = useContext(GlobalContext);
  const newMessages = getMessages(conversation);
  const { sim, identifier, contacts } = useSim(true, true);
  const chattingWith = contacts?.find((c) => c.uuid === conversation);
  const [history, setHistory] = useState<Message[]>([]);

  const messages = useMemo(() => [...history, ...newMessages], [newMessages, history]);

  const getMessageHistory = useCallback(async () => {
    if (sim && conversation) {
      const historicalMessages = await selectMessages(sim, conversation);
      console.log("CHANGING", sim, conversation);
      setHistory(historicalMessages);
    }
  }, [sim, conversation]);

  useEffect(() => {
    handleScrollBottom(true);
  }, [messages.length]);

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

  useEffect(() => {
    if (!history.length) getMessageHistory();
  }, [sim, conversation]);

  if (!chattingWith || !identifier || !sim) return null;

  return (
    <ScrollShadow
      hideScrollBar
      className="relative justify-end overflow-y-auto"
      visibility="top"
      isEnabled={messages.length > 4}
      ref={chatContainer}
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
          key={index}
          isSender={conversation === m.from}
          senderIdentifier={conversation === m.from ? chattingWith.name! : identifier}
          text={m.text}
          ref={index === messages.length - 1 ? messageRef : undefined}
        />
      ))}
      <ChatInput
        handleScrollBottom={handleScrollBottom}
        chattingWith={chattingWith}
        sim={sim}
        setHistory={setHistory}
      />
    </ScrollShadow>
  );
};
