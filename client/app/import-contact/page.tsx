import { getContact } from "@/api/getContact";
import { SearchParams } from "next/dist/server/request/search-params";
import { ImportContactForm } from "./components";

export default async function ImportContactPage(props: {
  children: React.ReactNode;
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;
  const contact = await getContact({ token: searchParams.token as string });

  if (!contact || !contact.data) {
    //TODO: Better UI/UX
    return "No contact found...";
  }

  return (
    <ImportContactForm
      contact={{
        uuid: contact.data.uuid,
        address: contact.data.address,
        publicKey: contact.data.public_key,
        identifier: contact.data.identifier,
      }}
    />
  );
}
