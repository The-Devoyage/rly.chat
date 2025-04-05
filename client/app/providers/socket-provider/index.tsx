import {
  createContext,
  FC,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { SerializedMessage, SimUuid } from "@/types";
import useWebSocket from "react-use-websocket";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import { SimContext } from "../sim-provider";
import { DatabaseContext } from "../db-provider";

interface SocketContext {
  sendJsonMessage: SendJsonMessage;
  messages: SerializedMessage[];
  watchMessages: (conversation: SimUuid) => SerializedMessage[];
}

export const SocketContext = createContext<SocketContext>({
  sendJsonMessage: () => null,
  messages: [],
  watchMessages: () => [],
});

export const SocketProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { decryptSim } = useContext(SimContext);
  const { db } = useContext(DatabaseContext);
  const [messages, setMessages] = useState<SerializedMessage[]>([]);
  const sim = decryptSim();

  const watchMessages = useCallback(
    (conversation: SimUuid) => {
      const conversationMessages = messages.filter((m) => m.conversation === conversation);
      return conversationMessages;
    },
    [messages],
  );

  const { sendJsonMessage, lastJsonMessage } = useWebSocket<SerializedMessage>(
    process.env.NEXT_PUBLIC_SOCKET_URL! + `/` + sim?.profile.address,
    {
      onMessage: (messageEvent: MessageEvent<string>) => {
        console.log("onMessage", messageEvent);
        try {
          const incomingMessage: SerializedMessage = JSON.parse(messageEvent.data);
          setMessages((curr) => [...curr, incomingMessage]);
        } catch (err) {
          console.error(err);
        }
      },
    },
    Boolean(sim),
  );

  useEffect(() => {
    const handleSaveIncoming = async () => {
      console.log("HANDLE SAVE", sim, lastJsonMessage);
      if (sim && lastJsonMessage) {
        console.log("SAVING");
        await db?.message.add({
          ...lastJsonMessage.encryptedMessage,
          conversation: lastJsonMessage.conversation,
        });
      }
    };
    handleSaveIncoming();
  }, [lastJsonMessage]);

  const value = useMemo(
    () => ({
      sendJsonMessage,
      messages,
      watchMessages,
    }),
    [messages],
  );

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
};
