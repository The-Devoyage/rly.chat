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
import { Contact, SerializedContact, SerializedMessage, SimUuid } from "@/types";
import useWebSocket from "react-use-websocket";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";
import { SimContext } from "../sim-provider";
import { DatabaseContext } from "../db-provider";
import { encryptData } from "@/utils/encryption";
import { getContact } from "@/api/getContact";

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
  const { decryptSim, simPassword } = useContext(SimContext);
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
      onMessage: async (messageEvent: MessageEvent<string>) => {
        try {
          const incomingMessage: SerializedMessage | SerializedContact = JSON.parse(
            messageEvent.data,
          );
          switch (incomingMessage.messageType) {
            case "message":
              setMessages((curr) => [...curr, incomingMessage as SerializedMessage]);
              break;
            case "contact":
              const contact = await getContact({
                token: (incomingMessage as SerializedContact).token,
              });
              if (!contact || !contact.data) {
                window.alert("Failed to receive contact.");
                return;
              }
              const encryptedContact = encryptData<Contact>({ ...contact.data }, simPassword!);
              await db!.contacts.add({ simUuid: contact.data.simUuid, ...encryptedContact });
              break;
          }
        } catch (err) {
          console.error(err);
        }
      },
      // shouldReconnect: () => true,
    },
    Boolean(sim),
  );

  useEffect(() => {
    const handleSaveIncoming = async () => {
      if (sim && lastJsonMessage && lastJsonMessage.messageType === "message") {
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
