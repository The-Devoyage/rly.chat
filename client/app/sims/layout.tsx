export default function CreateSimLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 w-full">
      <div className="flex gap-4 flex-col p-4 border border-sm rounded border-orange-500">
        SIMs
      </div>
      <div>{children}</div>
    </section>
  );
}
