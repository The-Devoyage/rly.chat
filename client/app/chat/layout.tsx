export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <section
      className="flex flex-col gap-4 w-full justify-between"
      style={{
        height: "calc(100vh - 130px)",
      }}
    >
      {children}
    </section>
  );
}
