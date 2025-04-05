export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <section
      className="flex flex-col gap-4 w-full justify-between"
      style={{
        height: "calc(100vh - 130px)",
      }}
    >
      <div className="flex gap-4 p-4 border border-sm rounded border-orange-500 justify-between items-center">
        Chat
      </div>
      {children}
    </section>
  );
}
