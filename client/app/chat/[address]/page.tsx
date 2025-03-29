import { ScrollingChat } from "./components";

export default async function ChatPage(props: {
  params: Promise<{ address: string }>;
  children: React.ReactNode;
}) {
  const params = await props.params;

  return <ScrollingChat />;
}
