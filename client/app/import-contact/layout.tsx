export default function CreateSimLayout({ children }: { children: React.ReactNode }) {
  return (
    <section
      className="flex flex-col gap-4 w-full"
      style={{
        height: "calc(100vh - 170px)",
      }}
    >
      <div className="flex gap-4 p-4 border border-sm rounded border-orange-500 justify-between items-center">
        Import Contact
      </div>
      {children}
    </section>
  );
}
