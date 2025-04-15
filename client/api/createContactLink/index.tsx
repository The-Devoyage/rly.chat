import { Contact, ServiceResponse } from "@/types";
import apiClient from "..";

export const createContactLink = async (payload: Contact) => {
  try {
    const res = await apiClient.post<ServiceResponse<{ token: string }>>(
      "/contact-link/encrypt",
      payload,
    );
    return res.data;
  } catch (err) {
    console.error(err);
    return false;
  }
};
