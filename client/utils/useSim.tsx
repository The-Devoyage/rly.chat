// "use client";
// import { Contact, Sim } from "@/types";
// import { useCallback, useContext, useEffect, useState } from "react";
// import { decryptData } from "./encryption";
// import { usePathname, useRouter, useSearchParams } from "next/navigation";
// import { selectContacts } from "@/idb/contacts";

// export const useSim = (requestUnlock = true, fetchContacts = false) => {
//   const [sim, setSim] = useState<Sim | null>(null);
//   const [identifier, setIdentifier] = useState<string | null>(null);
//   const [loading, setLoading] = useState(true);
//   const { simPassword, setRequestSimPassword, setSimPassword } = useContext(GlobalContext);
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchQuery = useSearchParams();
//   const [contacts, setContacts] = useState<Contact[] | null>(null);

//   const handleGetContacts = useCallback(
//     async (simUuid: string, password: string) => {
//       const contacts = await selectContacts(simUuid, password);
//       return contacts;
//     },
//     [sim, simPassword],
//   );

//   useEffect(() => {
//     const getSim = async () => {
//       try {
//         const storedSim = window.localStorage.getItem("sim");

//         if (!storedSim && requestUnlock) {
//           setIdentifier(null);
//           window.alert("Create a SIM first!");
//           router.push(
//             `/sims?redirect_uri=${process.env.NEXT_PUBLIC_CLIENT_URL}${pathname}?${searchQuery.toString()}`,
//           );
//           return;
//         }

//         const simData = JSON.parse(storedSim!);

//         if (!simData) {
//           setIdentifier(null);
//           return;
//         }

//         setIdentifier(simData["identifier"]);

//         if (!simPassword && requestUnlock) {
//           return setRequestSimPassword(true);
//         }

//         if (!simPassword || !requestUnlock) return;

//         const {
//           profile: { encryptedData, nonce },
//         } = simData;

//         const profile = decryptData(encryptedData, nonce, simPassword);

//         const sim: Sim = {
//           ...simData,
//           profile,
//         };

//         // Fetch Contacts
//         if (fetchContacts) {
//           const contacts = await handleGetContacts(sim.uuid, simPassword);
//           setContacts(contacts);
//         }

//         setSim(sim);
//         setLoading(false);
//       } catch (err) {
//         console.warn(err);
//         window.alert("Invalid Password");
//         setSimPassword(null);
//         setRequestSimPassword(false);
//       }
//     };

//     window.addEventListener("storage", getSim);

//     getSim();

//     return () => {
//       window.removeEventListener("storage", getSim);
//     };
//   }, [simPassword]);

//   const handleLock = () => {
//     setSimPassword(null);
//     router.push("/");
//   };

//   return { sim, loading, identifier, handleLock, contacts };
// };
