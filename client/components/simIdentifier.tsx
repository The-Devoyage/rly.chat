"use client";

import { useEffect, useState } from "react";

export const SimIdentifier = () => {
  const [simIdentifier, setSimIdentifier] = useState<string | null>(null);

  useEffect(() => {
    const sim = localStorage.getItem("sim");

    if (sim) {
      const parsed = JSON.parse(sim);
      setSimIdentifier(parsed["identifier"]);
    }
  }, []);

  if (!simIdentifier) return null;

  return <span>{simIdentifier}</span>;
};
