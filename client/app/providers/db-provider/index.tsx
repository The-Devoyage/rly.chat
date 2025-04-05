import { EncryptedSim, RlyDatabase } from "@/types";
import Dexie from "dexie";
import { createContext, FC, useEffect, useMemo, useState } from "react";

interface DatabaseContext {
  db: RlyDatabase | null;
}

export const DatabaseContext = createContext<DatabaseContext>({
  db: null,
});

export const DatabaseProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [db, setDb] = useState<RlyDatabase | null>(null);

  useEffect(() => {
    const connectDb = () => {
      try {
        const storedSim = window.localStorage.getItem("sim");
        if (!storedSim) return;
        const simData: EncryptedSim = JSON.parse(storedSim);
        if (!simData) return;
        const db = new Dexie(`rly_${simData.uuid}`) as RlyDatabase;
        db.version(1).stores({
          contacts: "++id, &simUuid",
          message: "++id, conversation",
        });
        setDb(db);
      } catch (err) {
        console.error(err);
      }
    };
    window.addEventListener("storage", connectDb);

    connectDb();

    return () => window.removeEventListener("storage", connectDb);
  }, []);

  const value = useMemo(() => ({ db }), [db]);

  return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>;
};
