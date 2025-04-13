import { getContact } from "@/api/getContact";
import { SearchParams } from "next/dist/server/request/search-params";
import { ImportContactForm } from "./components";

export default async function ImportContactPage(props: { searchParams: Promise<SearchParams> }) {
  const searchParams = await props.searchParams;
  const contact = await getContact({ token: searchParams.token as string });

  if (!contact || !contact.data) {
    return "No contact found...";
  }

  return <ImportContactForm contact={contact.data} />;
}
