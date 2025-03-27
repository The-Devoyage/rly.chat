import { Button } from "@heroui/button";

export default function CreateSimLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 w-full">
      <div className="flex gap-4  p-4 border border-sm rounded border-orange-500 justify-between items-center">
        Chat
        <Button size="sm" color="primary">
          Share Contact
        </Button>
      </div>
      <div>{children}</div>
    </section>
  );
}
