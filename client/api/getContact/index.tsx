import { ServiceResponse } from "@/types";
import apiClient from "..";

export const getContact = async (payload: { token: string }) => {
  try {
    const res = await apiClient.post<
      ServiceResponse<{ address: string; public_key: string; identifier: string }>
    >("/contact-link/decrypt", {
      token: payload.token,
    });
    return res.data;
  } catch (err) {
    return false;
  }
};
