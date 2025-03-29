"use client";
import { useEffect, useRef } from "react";
import { Textarea } from "@heroui/input";
import { Card } from "@heroui/card";
import { ScrollShadow } from "@heroui/scroll-shadow";
import clsx from "clsx";
import Avatar from "boring-avatars";
import { AVATAR_COLORS } from "@/utils/constants";
import { toDate } from "@/utils/dates";
import dayjs from "dayjs";

export const ScrollingChat = () => {
  const ref = useRef<HTMLDivElement>(null);
  const messages = [
    { identifier: "Stary", message: "Hey this is Stary, how are you?" },
    { identifier: "Red", message: "I am good, what's up!" },
    { identifier: "Stary", message: "I am doing well" },
    { identifier: "Red", message: "Thats great to hear." },
    {
      identifier: "Stary",
      message:
        "I am just trying to have a nice conversation! Thanks for listenning",
    },
    { identifier: "Red", message: "Of course - this iis great!" },
    { identifier: "Stary", message: "Are you here for anything else?" },
    { identifier: "Red", message: "Na just want to converse" },
    { identifier: "Stary", message: "Did you know this is all encrypted?" },
    { identifier: "Red", message: "Yup thats why I signed up" },
    {
      identifier: "Stary",
      message: "Where are the messages and files stored?",
    },
    { identifier: "Red", message: "On the IFPS" },
    { identifier: "Red", message: "On the IFPS" },
  ];

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);
  return (
    <ScrollShadow
      hideScrollBar
      className="relative justify-end overflow-y-auto"
      visibility="top"
    >
      {messages.map((m, index) => (
        <Card
          key={index}
          className={clsx("p-4 flex flex-row gap-4 my-2", {
            "bg-transparent shadow-none": m.identifier !== "Stary",
          })}
          style={{ maxWidth: 500 }}
          ref={index === messages.length - 1 ? ref : undefined}
        >
          <Avatar
            name={m.identifier}
            variant="beam"
            colors={AVATAR_COLORS}
            className="h-8 w-8"
          />
          <div className="flex flex-col gap-4">
            <div className="flex gap-2 items-center">
              <h2 className="font-bold">{m.identifier}</h2>
              <span className="text-xs text-gray-400">
                {toDate(dayjs().toISOString())}
              </span>
            </div>
            <p>{m.message}</p>
          </div>
        </Card>
      ))}
      <div className="mt-2 sticky -bottom-0.5">
        <Textarea placeholder="Your message..." />
      </div>
    </ScrollShadow>
  );
};
