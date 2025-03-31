import { Button } from "@heroui/button";
import { Contacts } from "./components";
import { ShareContactButton } from "./components/share-contact-button";

export default function ChatPage() {
  return (
    <div className="p-4 border border-sm rounded border-orange-500 h-full">
      <div className="flex justify-between items-center mb-4">
        Contacts
        <div className="flex gap-2">
          <Button size="sm" color="secondary" variant="ghost">Export</Button>
          <ShareContactButton />
        </div>
      </div>
      <Contacts />
    </div>
  );
}
