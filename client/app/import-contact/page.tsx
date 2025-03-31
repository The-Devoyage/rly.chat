import { getContact } from "@/api/getContact";
import { SearchParams } from "next/dist/server/request/search-params";
import { ImportContactForm } from "./components";

export default async function ImportContactPage(props: {
  children: React.ReactNode;
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;
  const contact = await getContact({ token: searchParams.token as string });

  console.log(contact);

  if (!contact || !contact.data) {
    return "AWE";
  }

  return (
    <ImportContactForm
      contact={{ address: contact.data.address, publicKey: contact.data.public_key }}
    />
  );
}
