import {
  Dispatch,
  FC,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { Textarea } from "@heroui/input";
import clsx from "clsx";
import { Contact, EncryptedMessage, Message, Sim, SimUuid } from "@/types";
import { Button } from "@heroui/button";
import { encryptMessage } from "@/utils/encryption";
import { insertMessage, selectMessages } from "@/idb/message";
import { GlobalContext } from "@/app/providers";

interface ChatInputProps {
  handleScrollBottom: (shouldScroll: boolean) => void;
  chattingWith: Contact;
  sim: Sim;
  setHistory: Dispatch<SetStateAction<Message[]>>;
}

export const ChatInput: FC<ChatInputProps> = ({
  handleScrollBottom,
  chattingWith,
  sim,
  setHistory,
}) => {
  const [message, setMessage] = useState("");
  const [maxRows, setMaxRows] = useState<number | undefined>(1);
  const { sendJsonMessage } = useContext(GlobalContext);

  useEffect(() => {
    handleScrollBottom(true);
  }, [message.length]);

  const handleSendMessage = async () => {
    if (!sim || !chattingWith) return;

    const m: Message = { to: chattingWith.uuid, from: sim.uuid, text: message };

    const recipientMessage = encryptMessage(
      chattingWith.publicKey,
      sim.profile.secretKey,
      JSON.stringify(m),
    );

    const senderMessage = encryptMessage(
      sim.profile.publicKey,
      sim.profile.secretKey,
      JSON.stringify(m),
    );

    const send: EncryptedMessage = {
      conversation: sim.uuid,
      address: chattingWith.address,
      ...recipientMessage,
    };

    const store: EncryptedMessage = {
      conversation: chattingWith.uuid,
      address: null,
      ...senderMessage,
    };

    await insertMessage(sim.uuid, store);
    setHistory((curr) => [...curr, m]);

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
