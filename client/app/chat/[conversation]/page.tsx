import { ScrollingChat } from "./components";

export default async function ChatPage(props: { params: Promise<{ conversation: string }> }) {
  const params = await props.params;

  return <ScrollingChat conversation={params.conversation} />;
}
