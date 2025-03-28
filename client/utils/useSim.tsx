"use client";
import { GlobalContext } from "@/app/providers";
import { Sim } from "@/types";
import { useContext, useEffect, useState } from "react";
import { decryptData } from "./encryption";
import { useRouter } from "next/navigation";

export const useSim = (requestUnlock = true) => {
  const [sim, setSim] = useState<Sim | null>(null);
  const [identifier, setIdentifier] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { simPassword, setRequestSimPassword, setSimPassword } =
    useContext(GlobalContext);
  const router = useRouter();

  useEffect(() => {
    const getSim = () => {
      try {
        const storedSim = window.localStorage.getItem("sim");

        if (!storedSim && requestUnlock) {
          setIdentifier(null);
          router.push("/sims");
          return;
        }

        const simData = JSON.parse(storedSim!);

        if (!simData) {
          setIdentifier(null);
          return;
        }

        setIdentifier(simData["identifier"]);

        if (!simPassword && requestUnlock) {
          return setRequestSimPassword(true);
        }

        if (!simPassword || !requestUnlock) return;

        const {
          profile: { encryptedData, nonce },
        } = simData;

        const profile = decryptData(encryptedData, nonce, simPassword);

        const sim: Sim = {
          identifier: simData["identifier"],
          profile,
        };
        setSim(sim);
        setLoading(false);
      } catch (err) {
        console.warn(err);
        window.alert("Invalid Password");
        setSimPassword(null);
        setRequestSimPassword(false);
      }
    };

    // Listen for localStorage changes from other tabs/windows
    window.addEventListener("storage", getSim);

    getSim();

    return () => {
      window.removeEventListener("storage", getSim);
    };
  }, [simPassword]);

  const handleLock = () => {
    setSimPassword(null);
    router.push("/");
  };

  return { sim, loading, identifier, handleLock };
};
