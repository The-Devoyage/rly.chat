import { Contacts } from "./components";

export default function ChatPage() {
  return (
    <div className="p-4 border border-sm rounded border-orange-500">
      <div className="flex justify-between items-center">
        Contacts
      </div>
      <Contacts />
    </div>
  );
}
