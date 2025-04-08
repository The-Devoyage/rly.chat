import { FC, useContext, useEffect, useState } from "react";
import { Textarea } from "@heroui/input";
import clsx from "clsx";
import { Contact, EncryptedMessage, Message, SerializedMessage, Sim } from "@/types";
import { Button } from "@heroui/button";
import { encryptMessage } from "@/utils/encryption";
import { SocketContext } from "@/app/providers/socket-provider";
import { DatabaseContext } from "@/app/providers/db-provider";

interface ChatInputProps {
  handleScrollBottom: (shouldScroll: boolean) => void;
  contact: Contact;
  sim: Sim;
}

export const ChatInput: FC<ChatInputProps> = ({ handleScrollBottom, contact, sim }) => {
  const [message, setMessage] = useState("");
  const [maxRows, setMaxRows] = useState<number | undefined>(1);
  const { sendJsonMessage } = useContext(SocketContext);
  const { db } = useContext(DatabaseContext);

  useEffect(() => {
    handleScrollBottom(true);
  }, [message.length]);

  const handleSendMessage = async () => {
    if (!sim || !contact) return;

    const m: Message = { to: contact.simUuid, from: sim.uuid, text: message };

    const recipientMessage = encryptMessage(
      contact.publicKey,
      sim.profile.secretKey,
      JSON.stringify(m),
    );

    const senderMessage = encryptMessage(
      sim.profile.publicKey,
      sim.profile.secretKey,
      JSON.stringify(m),
    );

    const send: SerializedMessage = {
      messageType: "message",
      conversation: sim.uuid,
      address: contact.address,
      encryptedMessage: {
        ...recipientMessage,
        sender: sim.uuid,
      },
    };

    const store: EncryptedMessage = {
      conversation: contact.simUuid,
      sender: sim.uuid,
      ...senderMessage,
    };

    await db?.message.add(store);

    sendJsonMessage(send);
  };

  return (
    <div
      className={clsx(
        "flex gap-1 items-end mt-2 sticky -bottom-0.5 dark:bg-zinc-800 rounded p-2",
        maxRows && !message ? "flex-row" : "flex-col",
      )}
    >
      <Textarea
        onFocusChange={(focused) => {
          setMaxRows(focused ? undefined : 1);
          handleScrollBottom(focused);
        }}
        placeholder="Your message..."
        onChange={(e) => {
          setMessage(e.currentTarget.value);
        }}
        value={message}
        maxRows={!!message ? undefined : maxRows}
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
  );
};
