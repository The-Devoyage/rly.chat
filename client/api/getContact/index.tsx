import { Contact, ServiceResponse } from "@/types";
import apiClient from "..";

export const getContact = async (payload: { token: string }) => {
  try {
    const res = await apiClient.post<ServiceResponse<Contact>>("/contact-link/decrypt", {
      token: payload.token,
    });
    return res.data;
  } catch (err) {
    return false;
  }
};
