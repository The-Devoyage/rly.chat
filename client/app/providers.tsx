"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { createContext } from "react";
import useWebSocket from "react-use-websocket";
import { Address, EncryptedMessage, Message, SimUuid } from "@/types";
import { SendJsonMessage } from "react-use-websocket/dist/lib/types";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>["push"]>[1]>;
  }
}

interface GlobalContext {
  simPassword: string | null;
  setSimPassword: React.Dispatch<React.SetStateAction<string | null>>;
  requestSimPassword: boolean;
  setRequestSimPassword: React.Dispatch<React.SetStateAction<boolean>>;
  getMessages: (conversation: SimUuid) => EncryptedMessage[];
  sendJsonMessage: SendJsonMessage;
}

export const GlobalContext = createContext<GlobalContext>({
  simPassword: null,
  setSimPassword: () => null,
  requestSimPassword: false,
  setRequestSimPassword: () => null,
  getMessages: () => [],
  sendJsonMessage: () => null,
});

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();
  const [simPassword, setSimPassword] = React.useState<string | null>(null);
  const [requestSimPassword, setRequestSimPassword] = React.useState(false);
  const [messages, setMessages] = React.useState<EncryptedMessage[]>([]);

  const { sendJsonMessage } = useWebSocket<EncryptedMessage>(process.env.NEXT_PUBLIC_SOCKET_URL!, {
    onMessage: (message: MessageEvent<EncryptedMessage>) => {
      setMessages((curr) => [...curr, message.data]);
    },
  });

  const getMessages = React.useCallback(
    (conversation: SimUuid) => {
      const msgs = messages.filter((m) => m.conversation === conversation);
      return msgs;
    },
    [messages],
  );

  const value = React.useMemo(
    () => ({
      simPassword,
      setSimPassword,
      requestSimPassword,
      setRequestSimPassword,
      getMessages,
      sendJsonMessage,
    }),
    [simPassword, requestSimPassword],
  );

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider {...themeProps}>
        <GlobalContext.Provider value={value}>{children}</GlobalContext.Provider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
