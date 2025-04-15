import { Address, ServiceResponse } from "@/types";
import apiClient from "..";

export const shareContactLink = async (payload: { address: Address; token: string }) => {
  try {
    const res = await apiClient.post<ServiceResponse<null>>("/contact-link/share", payload);
    return res.data;
  } catch (err) {
    console.error(err);
    return false;
  }
};
