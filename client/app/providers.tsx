"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { createContext } from "react";
import useWebSocket, { SendMessage } from "react-use-websocket";
import { Address, Message } from "@/types";

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
  getMessages: (address: Address) => Message[];
  sendMessage: SendMessage;
}

export const GlobalContext = createContext<GlobalContext>({
  simPassword: null,
  setSimPassword: () => null,
  requestSimPassword: false,
  setRequestSimPassword: () => null,
  getMessages: () => [],
  sendMessage: () => null,
});

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();
  const [simPassword, setSimPassword] = React.useState<string | null>(null);
  const [requestSimPassword, setRequestSimPassword] = React.useState(false);
  const [messages, setMessages] = React.useState<Message[]>([]);

  const { sendMessage } = useWebSocket<Message>(process.env.NEXT_PUBLIC_SOCKET_URL!, {
    onMessage: (message) => {
      console.log("MESSAGE", message);
      setMessages((curr) => [...curr, message.data]);
    },
  });

  const getMessages = React.useCallback(
    (address: Address) => {
      const msgs = messages.filter((m) => m.sender === address);
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
      sendMessage,
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
