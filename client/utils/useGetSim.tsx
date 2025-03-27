"use client";
import { useEffect, useState } from "react";

export const useGetSim = () => {
  const [simIdentifier, setSimIdentifier] = useState<string | null>(null);

  useEffect(() => {
    const updateSim = () => {
      const sim = window.localStorage.getItem("sim");
      setSimIdentifier(sim ? JSON.parse(sim).identifier : null);
    };

    // Listen for localStorage changes from other tabs/windows
    window.addEventListener("storage", updateSim);

    updateSim();

    return () => {
      window.removeEventListener("storage", updateSim);
    };
  }, []);

  return simIdentifier;
};
