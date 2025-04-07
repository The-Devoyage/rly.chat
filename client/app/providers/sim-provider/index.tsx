"use client";

import { EncryptedSim, Sim } from "@/types";
import { decryptData } from "@/utils/encryption";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  createContext,
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

interface SimContext {
  encryptedSim: EncryptedSim | null;
  simPassword: string | null;
  setSimPassword: Dispatch<SetStateAction<string | null>>;
  handleRequestUnlock: () => void;
  loading: boolean;
  requestSimPassword: boolean;
  setRequestSimPassword: Dispatch<SetStateAction<boolean>>;
  handleLock: () => void;
  decryptSim: () => Sim | null;
}

export const SimContext = createContext<SimContext>({
  encryptedSim: null,
  simPassword: null,
  handleRequestUnlock: () => {},
  setSimPassword: () => null,
  loading: false,
  requestSimPassword: false,
  setRequestSimPassword: () => {},
  handleLock: () => {},
  decryptSim: () => null,
});

export const SimProvider: FC<{ children: React.ReactNode }> = ({ children }) => {
  const [encryptedSim, setEncryptedSim] = useState<EncryptedSim | null>(null);
  const [simPassword, setSimPassword] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [requestSimPassword, setRequestSimPassword] = useState(false);

  useEffect(() => {
    const getSim = async () => {
      setLoading(true);
      try {
        const storedSim = window.localStorage.getItem("sim");

        if (!storedSim) {
          setEncryptedSim(null);
          return;
        }

        const simData = JSON.parse(storedSim);

        if (!simData) {
          window.alert("Invalid SIM.");
          setEncryptedSim(null);
          return;
        }

        setEncryptedSim(simData);
        setLoading(false);
      } catch (err) {
        console.warn(err);
        window.alert("Soemthing went wrong!");
      }
    };

    window.addEventListener("storage", getSim);

    getSim();

    return () => {
      window.removeEventListener("storage", getSim);
    };
  }, []);

  const handleRequestUnlock = useCallback(() => {
    setRequestSimPassword(true);
  }, []);

  const decryptSim = () => {
    if (simPassword && encryptedSim) {
      const {
        profile: { encryptedData, nonce },
        ...rest
      } = encryptedSim as EncryptedSim;

      const profile = decryptData<Sim["profile"]>(encryptedData, nonce, simPassword);

      if (!profile) return null;

      const decrypted: Sim = {
        ...rest,
        profile,
      };

      return decrypted;
    }

    return null;
  };

  const handleLock = () => {
    setSimPassword(null);
    router.push("/");
  };

  const value = useMemo(
    () => ({
      encryptedSim,
      handleRequestUnlock,
      setSimPassword,
      loading,
      requestSimPassword,
      setRequestSimPassword,
      handleLock,
      simPassword,
      decryptSim,
    }),
    [encryptedSim, handleRequestUnlock, loading, requestSimPassword, simPassword],
  );

  return <SimContext.Provider value={value}>{children}</SimContext.Provider>;
};
