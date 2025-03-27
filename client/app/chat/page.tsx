"use client";

import { Accordion, AccordionItem } from "@heroui/accordion";
import { Avatar } from "@heroui/avatar";
import BoringAvatar from "boring-avatars";

export default function ChatPage() {
  const defaultContent =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

  return (
    <Accordion selectionMode="multiple">
      <AccordionItem
        key="1"
        aria-label="Chung Miller"
        startContent={
          <BoringAvatar name="John S" className="w-10 h-10" variant="beam" />
        }
        subtitle="4 unread messages"
        title="Chung Miller"
      >
        {defaultContent}
      </AccordionItem>
      <AccordionItem
        key="2"
        aria-label="Janelle Lenard"
        startContent={
          <Avatar
            isBordered
            color="success"
            radius="lg"
            src="https://i.pravatar.cc/150?u=a042581f4e29026704d"
          />
        }
        subtitle="3 incompleted steps"
        title="Janelle Lenard"
      >
        {defaultContent}
      </AccordionItem>
      <AccordionItem
        key="3"
        aria-label="Zoey Lang"
        startContent={
          <Avatar
            isBordered
            color="warning"
            radius="lg"
            src="https://i.pravatar.cc/150?u=a04258114e29026702d"
          />
        }
        subtitle={
          <p className="flex">
            2 issues to<span className="text-primary ml-1">fix now</span>
          </p>
        }
        title="Zoey Lang"
      >
        {defaultContent}
      </AccordionItem>
    </Accordion>
  );
}
