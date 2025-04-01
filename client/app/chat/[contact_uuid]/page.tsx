import { ScrollingChat } from "./components";

export default async function ChatPage(props: {
  params: Promise<{ contact_uuid: string }>;
  children: React.ReactNode;
}) {
  const params = await props.params;

  return <ScrollingChat simUuid={params.contact_uuid} />;
}
